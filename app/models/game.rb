class Game < ApplicationRecord
  validates :buy_in, numericality: { greater_than_or_equal_to: 0 }
  belongs_to :club
  has_many :player_sessions, dependent: :destroy
end
