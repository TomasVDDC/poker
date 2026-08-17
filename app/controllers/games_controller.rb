class GamesController < ApplicationController
  allow_unauthenticated_access only: %i[ shared ]
  before_action :set_game, only: %i[ show edit update destroy shared]
  before_action :set_club, only: %i[show new create update destroy]

  inertia_share flash: -> { flash.to_hash }

  # GET /games
  # def index
  #   @games = Game.all
  #   render inertia: 'Game/Index', props: {
  #     games: @games.map do |game|
  #       serialize_game(game)
  #     end
  #   }
  # end

  # GET /games/1
  def show
    @player_sessions = @game.player_sessions
    render inertia: 'Game/Show', props: {
      club: serialize_club(@club),
      game: serialize_game(@game),
      player_sessions: serialize_and_transform_player_sessions(@player_sessions),
      conservation_of_currency:  serialize_conservation_of_currency(@player_sessions)
    }
  end

  # GET /games/new
  def new
    @game = Game.new
    render inertia: 'Game/New', props: {
      club: serialize_club(@club),
      game: serialize_game(@game)
    }
  end

  # GET /games/1/edit
  def edit
    render inertia: 'Game/Edit', props: {
      game: serialize_game(@game)
    }
  end

  # POST /games
  def create
    @game = @club.games.build(game_params)

    if @game.save
      redirect_to new_club_game_player_session_path(@club,@game), notice: "Game was successfully created."
    else
      redirect_to new_club_game_url, inertia: { errors: @game.errors }
    end
  end

  # PATCH/PUT /games/1
  def update
    logger.info "Game Params: #{game_params}"
    if @game.update(game_params)
      redirect_to club_path(@club), notice: "Game was successfully updated."
    else
      redirect_to club_path(@club), inertia: { errors: @game.errors }
    end
  end

  # DELETE /games/1
  def destroy
    @game.destroy!
    redirect_to club_path(@club), notice: "Game was successfully destroyed."
  end

  def shared
    @player_sessions = @game.player_sessions
    render inertia: 'Game/Show', props: {
      club: serialize_club(@club),
      game: serialize_game(@game),
      player_sessions: serialize_and_transform_player_sessions(@player_sessions),
      conservation_of_currency:  serialize_conservation_of_currency(@player_sessions),
      read_only: true
    }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    def set_club
      @club = Club.find(params[:club_id])
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:buy_in, :date)
    end

    def serialize_game(game)
      game.as_json(only: [
        :id, :club_id, :date
      ]).merge(buy_in: game.buy_in.to_f,
        formatted_buy_in: number_to_currency(game.buy_in, :unit => game.club&.currency))
    end

    def serialize_club(club)
      club.as_json(only: [
        :id
      ])
    end

    def serialize_and_transform_player_sessions(player_sessions)
      # sort by net_profit_or_loss
      player_sessions = player_sessions.sort_by(&:net_profit).reverse

      player_sessions.map do |player_session|
        currency = player_session.game.club.currency
        player_session.as_json(only: [
               :id, :game_id
             ]).merge( club_id: params[:club_id],player_name: player_session.player.name, formatted_created_at: player_session.created_at.to_date.to_formatted_s(:long_ordinal),
               formatted_amount_in: number_to_currency(player_session.amount_in, :unit => currency),
               formatted_amount_out: number_to_currency(player_session.amount_out, :unit => currency),
               net_profit_or_loss: number_to_currency(player_session.net_profit, :unit => currency) )

      end
    end

    def serialize_conservation_of_currency(player_sessions)
      player_sessions.sum(&:net_profit).to_f
    end


end
