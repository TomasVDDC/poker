class AddPlayerToClubs < ActiveRecord::Migration[8.0]
  def change
    add_reference :clubs, :player, foreign_key: true
  end
end
