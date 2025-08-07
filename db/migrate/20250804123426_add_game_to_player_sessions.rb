class AddGameToPlayerSessions < ActiveRecord::Migration[8.0]
  def change
    add_reference :player_sessions, :game, null: false, foreign_key: true
  end
end
