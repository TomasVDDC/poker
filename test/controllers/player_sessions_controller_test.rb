require "test_helper"

class PlayerSessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @player_session = player_sessions(:one)
  end

  test "should get index" do
    get player_sessions_url
    assert_response :success
  end

  test "should get new" do
    get new_player_session_url
    assert_response :success
  end

  test "should create player_session" do
    assert_difference("PlayerSession.count") do
      post player_sessions_url, params: { player_session: { number_of_buy_ins: @player_session.number_of_buy_ins, winnings: @player_session.winnings } }
    end

    assert_redirected_to player_session_url(PlayerSession.last)
  end

  test "should show player_session" do
    get player_session_url(@player_session)
    assert_response :success
  end

  test "should get edit" do
    get edit_player_session_url(@player_session)
    assert_response :success
  end

  test "should update player_session" do
    patch player_session_url(@player_session), params: { player_session: { number_of_buy_ins: @player_session.number_of_buy_ins, winnings: @player_session.winnings } }
    assert_redirected_to player_session_url(@player_session)
  end

  test "should destroy player_session" do
    assert_difference("PlayerSession.count", -1) do
      delete player_session_url(@player_session)
    end

    assert_redirected_to player_sessions_url
  end
end
