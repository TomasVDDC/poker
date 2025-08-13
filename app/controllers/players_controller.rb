class PlayersController < ApplicationController
  before_action :set_player, only: %i[ show edit update destroy ]
  before_action :set_club, only: %i[ new create update destroy]
  before_action :set_game, only: %i[ new create ]


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
      club: serialize_club(@club),
      game: serialize_game(@game),
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
    @player = @club.players.build(player_params)

    if @player.save
      redirect_to new_club_game_player_session_path({club_id: @club.id, id: @game.id}), notice: "Player was successfully created."
    else
      redirect_to club_url, inertia: { errors: @player.errors }
    end
  end

  # PATCH/PUT /players/1
  def update
    if @player.update(player_params)
      redirect_to club_path(@club), notice: "Player was successfully updated."
    else
      redirect_to edit_player_url(@player), inertia: { errors: @player.errors }
    end
  end

  # DELETE /players/1
  def destroy
    @player.destroy!
    redirect_to club_path(@club), notice: "Player was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_player
      @player = Player.find(params[:id])
    end

    def set_game
    @game = Game.find(params[:game_id])
       end

    def set_club
      @club = Club.find(params[:club_id])
    end

    # Only allow a list of trusted parameters through.
    def player_params
      params.require(:player).permit(:name)
    end

    def serialize_player(player)
      player.as_json(only: [
        :id,:club_id, :name
      ])
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
end
