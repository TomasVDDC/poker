class Game < ApplicationRecord
  # The standard buy in for this game. Only a default: a player session records
  # the money it actually put in, which may be any amount.
  validates :buy_in, numericality: { greater_than_or_equal_to: 0 }
  belongs_to :club
  has_many :player_sessions, dependent: :destroy
end
