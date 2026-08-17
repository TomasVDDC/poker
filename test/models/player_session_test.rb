require "test_helper"

class PlayerSessionTest < ActiveSupport::TestCase
  setup do
    @game = games(:one)
    @club = @game.club
  end

  test "net profit is cash out minus money in" do
    session = PlayerSession.new(amount_in: 50, amount_out: 125)
    assert_equal BigDecimal("75"), session.net_profit
  end

  test "records a rebuy that is not a whole multiple of the buy in" do
    player = Player.create!(club: @club, name: "Odd Rebuyer")
    session = PlayerSession.create!(game: @game, player: player, amount_in: 73.50, amount_out: 91.25)

    assert_equal BigDecimal("73.50"), session.reload.amount_in
    assert_equal BigDecimal("17.75"), session.net_profit
  end

  test "decimal amounts do not accumulate float error" do
    player = Player.create!(club: @club, name: "Precise")
    session = PlayerSession.create!(game: @game, player: player, amount_in: 0.10, amount_out: 0.30)

    assert_equal BigDecimal("0.20"), session.reload.net_profit
  end

  test "requires money in" do
    session = PlayerSession.new(game: @game, player: players(:one), amount_in: 0, amount_out: 10)
    assert_not session.valid?
    assert_includes session.errors[:amount_in], "must be greater than 0"
  end

  test "cash out may be zero but not negative" do
    player = Player.create!(club: @club, name: "Busted")
    assert PlayerSession.new(game: @game, player: player, amount_in: 20, amount_out: 0).valid?
    assert_not PlayerSession.new(game: @game, player: player, amount_in: 20, amount_out: -5).valid?
  end
end
