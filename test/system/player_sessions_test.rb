require "application_system_test_case"

class PlayerSessionsTest < ApplicationSystemTestCase
  setup do
    @player_session = player_sessions(:one)
  end

  test "visiting the index" do
    visit player_sessions_url
    assert_selector "h1", text: "Player sessions"
  end

  test "should create player session" do
    visit player_sessions_url
    click_on "New player session"

    fill_in "Number of buy ins", with: @player_session.number_of_buy_ins
    fill_in "Winnings", with: @player_session.winnings
    click_on "Create Player session"

    assert_text "Player session was successfully created"
    click_on "Back"
  end

  test "should update Player session" do
    visit player_session_url(@player_session)
    click_on "Edit this player session", match: :first

    fill_in "Number of buy ins", with: @player_session.number_of_buy_ins
    fill_in "Winnings", with: @player_session.winnings
    click_on "Update Player session"

    assert_text "Player session was successfully updated"
    click_on "Back"
  end

  test "should destroy Player session" do
    visit player_session_url(@player_session)
    click_on "Destroy this player session", match: :first

    assert_text "Player session was successfully destroyed"
  end
end
