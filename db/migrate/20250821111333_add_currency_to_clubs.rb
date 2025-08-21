class AddCurrencyToClubs < ActiveRecord::Migration[8.0]
  def change
    add_column :clubs, :currency, :string, null: false
  end
end
