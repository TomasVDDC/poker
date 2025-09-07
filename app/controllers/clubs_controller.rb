include ActionView::Helpers::NumberHelper

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
    render inertia: 'Club/Show', props: {
      club: serialize_club(@club),
      games: @games.map do |game|
          serialize_game(game)
      end,
      players: serialize_and_transform_players(@players),
      chart_data: create_chart(@club),
      read_only: false
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
    render inertia: 'Club/Show', props: {
      club: serialize_club(@club),
      games: @games.map do |game|
          serialize_game(game)
      end,
      players: serialize_and_transform_players(@players),
      chart_data: create_chart(@club),
      read_only: true
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
        acc = 0
        player.player_sessions.map do |player_session|
         acc += player_session.winnings - ( player_session.number_of_buy_ins * player_session.game.buy_in )
        end
        net_profit_over_all_games << acc
      end

      logger.info "net profit over all games #{net_profit_over_all_games}"
      players_sorted = players.zip(net_profit_over_all_games).sort_by { |_ , net_profit| net_profit }.reverse

      # players = players.sort_by { |a| a.player_sessions.sum(:winnings) - ( a.player_sessions.sum(:number_of_buy_ins) * buy_in )}
      logger.info "player_sorted by total_net_profit_or_loss #{players}"
      players_sorted.map do |player, net_profit|
        player.as_json(only: [
          :id, :club_id, :name
        ]).merge(net_profit: number_to_currency(net_profit, :unit => player.club.currency))
      end
    end

    def serialize_game(game)
      game.as_json(only: [
        :id, :club_id, :date
      ]).merge(pot: calculate_pot(game),
        formatted_buy_in: number_to_currency(game.buy_in, :unit => game.club.currency))
    end

    def calculate_pot(game)
      number_to_currency(game.player_sessions.pluck(:winnings).sum, :unit => game.club.currency)
    end

    def create_chart(club)
      chart_data = []

      club.games.each do |game|
        data_point = {}
        data_point["date"] = game.date
        game.player_sessions.each do |player_session|
          net_winnings = player_session.winnings - (player_session.number_of_buy_ins * game.buy_in)
          previous_winnings = chart_data.last&.[](player_session.player.name) || 0
          data_point[player_session.player.name] =  previous_winnings + net_winnings
        end

        chart_data << data_point

      end
      return chart_data
    end

end
