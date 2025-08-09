class PlayerSessionsController < ApplicationController
  before_action :set_player_session, only: %i[ show edit update destroy ]
  before_action :set_club, only: %i[ create new show edit update destroy ]
  before_action :set_game, only: %i[ create new show edit update destroy ]
  before_action :set_player, only: %i[ create ]

  inertia_share flash: -> { flash.to_hash }

  # GET /player_sessions
  def index
    @player_sessions = PlayerSession.all
    render inertia: 'PlayerSession/Index', props: {
      player_sessions: @player_sessions.map do |player_session|
        serialize_player_session(player_session)
      end
    }
  end

  # GET /player_sessions/1
  def show
    render inertia: 'PlayerSession/Show', props: {
      player_session: serialize_player_session(@player_session)
    }
  end

  # GET /player_sessions/new
  def new
    @player_session = PlayerSession.new
    @players = @club.players

    render inertia: 'PlayerSession/New', props: {
      club: serialize_club(@club),
      game: serialize_game(@game),
      player_session: serialize_player_session(@player_session),
      players: @players.map do |player|
        serialize_player(player)
      end
    }
  end

  # GET /player_sessions/1/edit
  def edit
    render inertia: 'PlayerSession/Edit', props: {
      club: serialize_club(@club),
      player_session: serialize_player_session(@player_session)
    }
  end

  # POST /player_sessions
  def create
    @player_session = PlayerSession.new(player_session_params.merge(
        game_id: @game.id,
        player_id: @player.id
    ))

    if @player_session.save
      redirect_to club_game_path({club_id: @club.id, id: @game.id}), notice: "Player session was successfully created."
    else
      redirect_to new_club_game_url, inertia: { errors: @player_session.errors }
    end
  end

  # PATCH/PUT /player_sessions/1
  def update
    if @player_session.update(player_session_params)
      redirect_to club_game_path({club_id: @club.id, id: @game.id}), notice: "Player session was successfully updated."
    else
      redirect_to new_club_game_url, inertia: { errors: @player_session.errors }
    end
  end

  # DELETE /player_sessions/1
  def destroy
    @player_session.destroy!
    redirect_to player_sessions_url, notice: "Player session was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_player_session
      @player_session = PlayerSession.find(params[:id])
    end

    def set_club
      logger.info "Params: #{params}"
      @club = Club.find(params[:club_id])
    end

    def set_game
      @game= Game.find(params[:game_id])
    end

    def set_player
      logger.info "Params: #{params}"
      @player= Player.find(params[:player_id])
   end

    # Only allow a list of trusted parameters through.
    def player_session_params
      params.require(:player_session).permit(:number_of_buy_ins, :winnings)
    end

    def serialize_club(club)
      club.as_json(only: [
        :id
      ])
    end

    def serialize_game(game)
      game.as_json(only: [
        :id
      ])
    end

    def serialize_player_session(player_session)
      player_session.as_json(only: [
        :id, :game_id, :number_of_buy_ins, :winnings
      ])
    end

    def serialize_player(player)
      player.as_json(only: [
        :id, :name
      ])
    end

end
