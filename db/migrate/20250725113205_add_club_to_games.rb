class AddClubToGames < ActiveRecord::Migration[8.0]
  def change
    add_reference :games, :club, null: false, foreign_key: true
  end
end
