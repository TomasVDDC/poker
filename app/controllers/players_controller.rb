class PlayersController < ApplicationController
  before_action :set_player, only: %i[ show edit update destroy ]

  inertia_share flash: -> { flash.to_hash }

  # GET /players
  def index
    @players = Player.all
    render inertia: 'Player/Index', props: {
      players: @players.map do |player|
        serialize_player(player)
      end
    }
  end

  # GET /players/1
  def show
    render inertia: 'Player/Show', props: {
      player: serialize_player(@player)
    }
  end

  # GET /players/new
  def new
    @player = Player.new
    render inertia: 'Player/New', props: {
      player: serialize_player(@player)
    }
  end

  # GET /players/1/edit
  def edit
    render inertia: 'Player/Edit', props: {
      player: serialize_player(@player)
    }
  end

  # POST /players
  def create
    @player = Player.new(player_params)

    if @player.save
      redirect_to @player, notice: "Player was successfully created."
    else
      redirect_to new_player_url, inertia: { errors: @player.errors }
    end
  end

  # PATCH/PUT /players/1
  def update
    if @player.update(player_params)
      redirect_to @player, notice: "Player was successfully updated."
    else
      redirect_to edit_player_url(@player), inertia: { errors: @player.errors }
    end
  end

  # DELETE /players/1
  def destroy
    @player.destroy!
    redirect_to players_url, notice: "Player was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_player
      @player = Player.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def player_params
      params.require(:player).permit(:name)
    end

    def serialize_player(player)
      player.as_json(only: [
        :id, :name
      ])
    end
end
