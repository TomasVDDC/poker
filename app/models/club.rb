class Club < ApplicationRecord
  has_many :games, dependent: :destroy
  has_many :players, dependent: :destroy

end
