class PlayerSession < ApplicationRecord
  validates :player_id, uniqueness: { scope: :game_id }
  validates :winnings, numericality: {greater_than_or_equal_to: 0}
  validates :number_of_buy_ins, numericality: {greater_than_or_equal_to: 1}
  belongs_to :game
  belongs_to :player
end
