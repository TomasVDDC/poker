class ReplaceBuyInCountWithAmounts < ActiveRecord::Migration[8.0]
  BACKUP_TABLE = :player_sessions_pre_amounts

  def up
    # Copy the originals out before touching anything, so this migration is
    # recoverable on its own in every environment it runs in, not just wherever
    # someone remembered to take a dump first. Dropped by a follow up migration
    # once the new columns have been trusted in production for a while.
    create_table BACKUP_TABLE do |t|
      t.integer :player_session_id, null: false
      t.integer :number_of_buy_ins
      t.float :winnings
    end
    execute <<~SQL
      INSERT INTO #{BACKUP_TABLE} (player_session_id, number_of_buy_ins, winnings)
      SELECT id, number_of_buy_ins, winnings FROM player_sessions
    SQL

    add_column :player_sessions, :amount_in, :decimal, precision: 10, scale: 2
    add_column :player_sessions, :amount_out, :decimal, precision: 10, scale: 2

    execute <<~SQL
      UPDATE player_sessions
      SET amount_in = ROUND(
            COALESCE(number_of_buy_ins, 0) *
            COALESCE((SELECT buy_in FROM games WHERE games.id = player_sessions.game_id), 0),
            2
          ),
          amount_out = ROUND(COALESCE(winnings, 0), 2)
    SQL

    # Prove the backfill before the old columns become unreachable. Raising here
    # rolls the whole migration back with the source data still in place.
    verify_backfill!

    remove_column :player_sessions, :number_of_buy_ins
    remove_column :player_sessions, :winnings

    change_column :games, :buy_in, :decimal, precision: 10, scale: 2
  end

  def down
    change_column :games, :buy_in, :float

    add_column :player_sessions, :number_of_buy_ins, :integer
    add_column :player_sessions, :winnings, :float

    # Sessions that predate the migration restore exactly from the backup table.
    execute <<~SQL
      UPDATE player_sessions
      SET number_of_buy_ins = (
            SELECT b.number_of_buy_ins FROM #{BACKUP_TABLE} b
            WHERE b.player_session_id = player_sessions.id
          ),
          winnings = (
            SELECT b.winnings FROM #{BACKUP_TABLE} b
            WHERE b.player_session_id = player_sessions.id
          )
      WHERE EXISTS (
        SELECT 1 FROM #{BACKUP_TABLE} b WHERE b.player_session_id = player_sessions.id
      )
    SQL

    # Anything recorded after the migration has no original to restore, so it
    # collapses onto the nearest whole multiple of the game's buy in. This is the
    # lossy case: an odd rebuy cannot be expressed by the old columns at all.
    execute <<~SQL
      UPDATE player_sessions
      SET number_of_buy_ins = MAX(1, CAST(ROUND(
            COALESCE(amount_in, 0) /
            NULLIF((SELECT buy_in FROM games WHERE games.id = player_sessions.game_id), 0)
          ) AS INTEGER)),
          winnings = COALESCE(amount_out, 0)
      WHERE number_of_buy_ins IS NULL
    SQL

    remove_column :player_sessions, :amount_in
    remove_column :player_sessions, :amount_out

    drop_table BACKUP_TABLE
  end

  private
    def verify_backfill!
      backed_up = select_value("SELECT COUNT(*) FROM #{BACKUP_TABLE}").to_i
      total = select_value("SELECT COUNT(*) FROM player_sessions").to_i
      if backed_up != total
        raise "Backup holds #{backed_up} rows but player_sessions has #{total}; aborting before dropping columns."
      end

      # 0.01 absorbs the rounding to pence; anything larger means the conversion
      # itself is wrong, not just rounded.
      mismatched = select_value(<<~SQL).to_i
        SELECT COUNT(*) FROM player_sessions ps
        LEFT JOIN games g ON g.id = ps.game_id
        WHERE ps.amount_in IS NULL
           OR ps.amount_out IS NULL
           OR ABS(ps.amount_in - COALESCE(ps.number_of_buy_ins, 0) * COALESCE(g.buy_in, 0)) > 0.01
           OR ABS(ps.amount_out - COALESCE(ps.winnings, 0)) > 0.01
      SQL
      if mismatched > 0
        raise "#{mismatched} of #{total} player_sessions did not convert correctly; aborting before dropping columns."
      end

      say "verified #{total} player_sessions converted, originals kept in #{BACKUP_TABLE}"
    end
end
