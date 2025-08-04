class AddClubToPlayers < ActiveRecord::Migration[8.0]
  def change
    add_reference :players, :club, null: false, foreign_key: true
  end
end
