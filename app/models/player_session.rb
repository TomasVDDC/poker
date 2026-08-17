class PlayerSession < ApplicationRecord
  validates :player_id, uniqueness: { scope: :game_id }
  validates :amount_in, numericality: {greater_than: 0}
  validates :amount_out, numericality: {greater_than_or_equal_to: 0}
  belongs_to :game
  belongs_to :player

  def net_profit
    amount_out - amount_in
  end
end
