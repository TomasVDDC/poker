class PlayerSessionsController < ApplicationController
  before_action :set_player_session, only: %i[ show edit update destroy ]

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
    @players = Player.all

    render inertia: 'PlayerSession/New', props: {
      player_session: serialize_player_session(@player_session),
      players: @players.map do |player|
        serialize_player(player)
      end
    }
  end

  # GET /player_sessions/1/edit
  def edit
    render inertia: 'PlayerSession/Edit', props: {
      player_session: serialize_player_session(@player_session)
    }
  end

  # POST /player_sessions
  def create
    @player_session = PlayerSession.new(player_session_params)

    if @player_session.save
      redirect_to @player_session, notice: "Player session was successfully created."
    else
      redirect_to new_player_session_url, inertia: { errors: @player_session.errors }
    end
  end

  # PATCH/PUT /player_sessions/1
  def update
    if @player_session.update(player_session_params)
      redirect_to @player_session, notice: "Player session was successfully updated."
    else
      redirect_to edit_player_session_url(@player_session), inertia: { errors: @player_session.errors }
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

    # Only allow a list of trusted parameters through.
    def player_session_params
      params.require(:player_session).permit(:number_of_buy_ins, :winnings)
    end

    def serialize_player_session(player_session)
      player_session.as_json(only: [
        :id, :number_of_buy_ins, :winnings
      ])
    end

    def serialize_player(player)
      player.as_json(only: [
        :id, :name
      ])
    end

end
