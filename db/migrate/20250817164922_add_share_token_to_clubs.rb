class AddShareTokenToClubs < ActiveRecord::Migration[8.0]
  def change
    add_column :clubs, :share_token, :string
    add_index :clubs, :share_token, unique: true
  end
end
