class GamesController < ApplicationController
  before_action :set_game, only: %i[ show edit update destroy ]
  before_action :set_club, only: %i[ new create update destroy]

  inertia_share flash: -> { flash.to_hash }

  # GET /games
  def index
    @games = Game.all
    render inertia: 'Game/Index', props: {
      games: @games.map do |game|
        serialize_game(game)
      end
    }
  end

  # GET /games/1
  def show
    render inertia: 'Game/Show', props: {
      game: serialize_game(@game)
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
      redirect_to club_path(@club), notice: "Game was successfully created."
    else
      redirect_to new_club_game_url, inertia: { errors: @game.errors }
    end
  end

  # PATCH/PUT /games/1
  def update
    if @game.update(game_params)
      redirect_to club_path(@club), notice: "Game was successfully updated."
    else
      redirect_to edit_game_url(@game), inertia: { errors: @game.errors }
    end
  end

  # DELETE /games/1
  def destroy
    @game.destroy!
    redirect_to club_path(@club), notice: "Game was successfully destroyed."
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
      params.require(:game).permit(:buy_in)
    end

    def serialize_game(game)
      game.as_json(only: [
        :id, :club_id, :buy_in
      ])
    end

    def serialize_club(club)
      club.as_json(only: [
        :id
      ])
    end

end
