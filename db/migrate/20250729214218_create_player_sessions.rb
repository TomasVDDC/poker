class CreatePlayerSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :player_sessions do |t|
      t.integer :number_of_buy_ins
      t.float :winnings

      t.timestamps
    end
  end
end
