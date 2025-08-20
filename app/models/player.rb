class Player < ApplicationRecord
  belongs_to :club
  has_many :player_sessions
  validates :name, presence: true, uniqueness: { scope: :club_id, case_sensitive: false }
end
