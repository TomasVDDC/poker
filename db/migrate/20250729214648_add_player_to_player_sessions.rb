class AddPlayerToPlayerSessions < ActiveRecord::Migration[8.0]
  def change
    add_reference :player_sessions, :player, null: false, foreign_key: true
  end
end
