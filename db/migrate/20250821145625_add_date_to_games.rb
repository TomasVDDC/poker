class AddDateToGames < ActiveRecord::Migration[8.0]
  def change
    add_column :games, :date, :string, null: false
  end
end
