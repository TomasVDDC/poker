
class ClubsController < ApplicationController
  allow_unauthenticated_access only: %i[ shared ]
  before_action :set_club, only: %i[ show edit update destroy ]
  inertia_share flash: -> { flash.to_hash }

  # GET /clubs
  def index
    @clubs = Club.all
    render inertia: 'Club/Index', props: {
      clubs: @clubs.map do |club|
        serialize_club(club)
      end
    }
  end

  # GET /clubs/1
  def show
    @games = @club.games.order(created_at: :desc)
    @players = @club.players
    money_in_play = calculate_money_in_play(@players)
    render inertia: 'Club/Show', props: {
      club: serialize_club(@club),
      games: @games.map do |game|
          serialize_game(game)
      end,
      players: serialize_and_transform_players(@players),
      chart_data: create_chart(@club),
      read_only: false,
      money_in_play: number_to_currency(money_in_play, unit: @club.currency),
      biggest_win: calculate_biggest_session_win(@club),
      biggest_loss: calculate_biggest_session_loss(@club)
    }
  end

  # GET /clubs/new
  def new
    @club = Club.new
    render inertia: 'Club/New', props: {
      club: serialize_club(@club),
    }
  end

  # GET /clubs/1/edit
  def edit
    @players = @club.players
    render inertia: 'Club/Edit', props: {
      club: serialize_club(@club),
      players: @players.map do |player|
          serialize_player(player)
      end
    }
  end

  # POST /clubs
  def create
    share_token = Random.hex(16)
    @club = Club.new(club_params.merge(share_token: share_token))

    if @club.save
      redirect_to new_club_player_path(@club), notice: "Club was successfully created."
    else
      redirect_to new_club_url, inertia: { errors: @club.errors }
    end
  end

  # PATCH/PUT /clubs/1
  def update
    if @club.update(club_params)
      redirect_to @club, notice: "Club was successfully updated."
    else
      redirect_to edit_club_url(@club), inertia: { errors: @club.errors }
    end
  end

  # DELETE /clubs/1
  def destroy
    @club.destroy!
    redirect_to clubs_url, notice: "Club was successfully destroyed."
  end

  def shared
    logger.info "Club params: #{params}"
    @club = Club.find_by!(share_token: params[:share_token])
    @games = @club.games.order(created_at: :desc)
    @players = @club.players
    money_in_play = calculate_money_in_play(@players)
    render inertia: 'Club/Show', props: {
      club: serialize_club(@club),
      games: @games.map do |game|
          serialize_game(game)
      end,
      players: serialize_and_transform_players(@players),
      chart_data: create_chart(@club),
      read_only: true,
      money_in_play: number_to_currency(money_in_play, unit: @club.currency),
      biggest_win: calculate_biggest_session_win(@club),
      biggest_loss: calculate_biggest_session_loss(@club)
    }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_club
      @club = Club.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def club_params
      params.require(:club).permit(:name,:currency)
    end

    def serialize_club(club)
      club.as_json(only: [
        :id, :name, :share_token, :currency
      ])
    end

    def serialize_player(player)
      player.as_json(only: [
        :id, :club_id, :name
      ])
    end

    def serialize_and_transform_players(players)
      net_profit_over_all_games = Array.new
      players.map do |player|
        net_profit_over_all_games << player.player_sessions.sum(&:net_profit)
      end

      logger.info "net profit over all games #{net_profit_over_all_games}"
      players_sorted = players.zip(net_profit_over_all_games).sort_by { |_ , net_profit| net_profit }.reverse

      logger.info "player_sorted by total_net_profit_or_loss #{players}"
      players_sorted.map do |player, net_profit|
        player.as_json(only: [
          :id, :club_id, :name
        ]).merge(
          net_profit: number_to_currency(net_profit, :unit => player.club.currency),
          winning_streak: calculate_winning_streak(player)
        )
      end
    end

    def serialize_game(game)
      game.as_json(only: [
        :id, :club_id, :date
      ]).merge(pot: calculate_pot(game),
        formatted_buy_in: number_to_currency(game.buy_in, :unit => game.club.currency),
        player_count: game.player_sessions.size)
    end

    def calculate_pot(game)
      number_to_currency(game.player_sessions.sum(:amount_out), :unit => game.club.currency)
    end

    def calculate_money_in_play(players)
      players.sum do |player|
        net_profit = player.player_sessions.sum(&:net_profit)
        net_profit > 0 ? net_profit : 0
      end
    end

    def create_chart(club)
      chart_data = []
      cumulative = Hash.new(0)

      club.games.each do |game|
        data_point = {}
        data_point["date"] = game.date
        game.player_sessions.each do |player_session|
          cumulative[player_session.player.name] += player_session.net_profit.to_f
          data_point[player_session.player.name] = cumulative[player_session.player.name]
        end

        chart_data << data_point

      end
      return chart_data
    end

    def calculate_winning_streak(player)
      sessions = player.player_sessions.includes(:game).to_a.sort { |a, b| Date.parse(b.game.date) <=> Date.parse(a.game.date) }
      logger.info "Calculating winning streak for player: #{player.name}"

      streak = 0
      sessions.each do |session|
        profit = session.net_profit
        logger.info "Session date: #{session.game.date}, profit: #{profit}"
        break if profit <= 0
        streak += 1
      end
      logger.info "Final streak for #{player.name}: #{streak}"
      streak
    end

    def calculate_biggest_session_win(club)
      best_session = club.games
        .includes(player_sessions: [:player, :game])
        .flat_map(&:player_sessions)
        .max_by(&:net_profit)

      return nil unless best_session
      profit = best_session.net_profit
      return nil if profit <= 0
      { player_name: best_session.player.name, amount: number_to_currency(profit, unit: club.currency) }
    end

    def calculate_biggest_session_loss(club)
      worst_session = club.games
        .includes(player_sessions: [:player, :game])
        .flat_map(&:player_sessions)
        .min_by(&:net_profit)

      return nil unless worst_session
      loss = worst_session.net_profit
      return nil if loss >= 0
      { player_name: worst_session.player.name, amount: number_to_currency(loss, unit: club.currency) }
    end

end
