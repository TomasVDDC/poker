class CreateGames < ActiveRecord::Migration[8.0]
  def change
    create_table :games do |t|
      t.float :buy_in

      t.timestamps
    end
  end
end
