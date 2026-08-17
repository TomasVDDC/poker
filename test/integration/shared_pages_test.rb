require "test_helper"

# The shared/* routes are the only ones reachable without a session, so they are
# the cheapest way to exercise the money maths through a real request.
class SharedPagesTest < ActionDispatch::IntegrationTest
  setup do
    @club = clubs(:one)
    @game = games(:one)
    # Amounts that are not whole multiples of the £1.50 buy in.
    @winner = Player.create!(club: @club, name: "Winner")
    @loser = Player.create!(club: @club, name: "Loser")
    PlayerSession.create!(game: @game, player: @winner, amount_in: 4.25, amount_out: 11.75)
    PlayerSession.create!(game: @game, player: @loser, amount_in: 7.50, amount_out: 0)
  end

  test "shared game page reports money in, money out and net profit" do
    props = page_props("/clubs/shared/#{@club.share_token}/games/#{@game.id}")

    winner = props["player_sessions"].find { |s| s["player_name"] == "Winner" }
    loser = props["player_sessions"].find { |s| s["player_name"] == "Loser" }

    assert_equal "£4.25", winner["formatted_amount_in"]
    assert_equal "£11.75", winner["formatted_amount_out"]
    assert_equal "£7.50", winner["net_profit_or_loss"]
    assert_equal "-£7.50", loser["net_profit_or_loss"]

    # The winner is up exactly what the loser is down, and the fixture session broke even.
    assert_equal 0.0, props["conservation_of_currency"]
  end

  test "shared club page totals net profit across sessions" do
    props = page_props("/clubs/shared/#{@club.share_token}")

    assert_equal "£7.50", props.dig("biggest_win", "amount")
    assert_equal "-£7.50", props.dig("biggest_loss", "amount")
    assert_equal "£7.50", props["money_in_play"]

    winner = props["players"].find { |p| p["name"] == "Winner" }
    assert_equal "£7.50", winner["net_profit"]
  end

  private
    # Inertia embeds the page object in the HTML shell as a data attribute.
    def page_props(path)
      get path
      assert_response :success
      JSON.parse(response.parsed_body.at("#app")["data-page"]).fetch("props")
    end
end
