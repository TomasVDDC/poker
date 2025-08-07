class Game < ApplicationRecord
  belongs_to :club
  has_many :player_sessions
end
