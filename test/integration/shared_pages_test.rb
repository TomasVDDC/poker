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

  test "shared record page tracks the biggest win over time" do
    later = Game.create!(club: @club, buy_in: 5, date: "3rd January 2025")
    # A bigger win breaks the record; a smaller loss leaves the old one standing.
    PlayerSession.create!(game: later, player: @loser, amount_in: 5, amount_out: 25)
    PlayerSession.create!(game: later, player: @winner, amount_in: 5, amount_out: 0)

    win = page_props("/clubs/shared/#{@club.share_token}/records/biggest_win")
    assert_equal [
      { "date" => @game.date, "biggest_win" => 7.5, "player" => "Winner" },
      { "date" => later.date, "biggest_win" => 20.0, "player" => "Loser" }
    ], win["chart_data"]
    assert_equal({ "player_name" => "Loser", "amount" => "£20.00", "times_broken" => 2 }, win["stats"])

    loss = page_props("/clubs/shared/#{@club.share_token}/records/biggest_loss")
    assert_equal [
      { "date" => @game.date, "biggest_loss" => -7.5, "player" => "Loser" },
      { "date" => later.date, "biggest_loss" => -7.5, "player" => "Loser" }
    ], loss["chart_data"]
    assert_equal 1, loss.dig("stats", "times_broken")
  end

  test "matching a record hands it to the latest player to reach it" do
    later = Game.create!(club: @club, buy_in: 5, date: "3rd January 2025")
    # Winner loses exactly the £7.50 that Loser lost in the first game.
    PlayerSession.create!(game: later, player: @winner, amount_in: 7.50, amount_out: 0)
    PlayerSession.create!(game: later, player: @loser, amount_in: 5, amount_out: 12.50)

    loss = page_props("/clubs/shared/#{@club.share_token}/records/biggest_loss")
    assert_equal [
      { "date" => @game.date, "biggest_loss" => -7.5, "player" => "Loser" },
      { "date" => later.date, "biggest_loss" => -7.5, "player" => "Winner" }
    ], loss["chart_data"]
    assert_equal({ "player_name" => "Winner", "amount" => "-£7.50", "times_broken" => 2 }, loss["stats"])

    club = page_props("/clubs/shared/#{@club.share_token}")
    assert_equal({ "player_name" => "Winner", "amount" => "-£7.50" }, club["biggest_loss"])
    assert_equal({ "player_name" => "Loser", "amount" => "£7.50" }, club["biggest_win"])
  end

  test "shared record page rejects unknown records" do
    get "/clubs/shared/#{@club.share_token}/records/most_rebuys"
    assert_response :not_found
  end

  test "shared player page reports stats from the new amounts" do
    props = page_props("/clubs/shared/#{@club.share_token}/players/#{@winner.id}")

    assert_equal 1, props.dig("stats", "number_of_games")
    assert_equal "£7.50", props.dig("stats", "biggest_win")
    assert_equal [{ "date" => @game.date, "Winner" => 7.5 }], props["chart_data"]
  end

  private
    # Inertia embeds the page object in the HTML shell as a data attribute.
    def page_props(path)
      get path
      assert_response :success
      JSON.parse(response.parsed_body.at("#app")["data-page"]).fetch("props")
    end
end
