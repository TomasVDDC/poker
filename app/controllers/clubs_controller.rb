class ClubsController < ApplicationController
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
    render inertia: 'Club/Show', props: {
      club: serialize_club(@club)
    }
  end

  # GET /clubs/new
  def new
    @club = Club.new
    render inertia: 'Club/New', props: {
      club: serialize_club(@club)
    }
  end

  # GET /clubs/1/edit
  def edit
    render inertia: 'Club/Edit', props: {
      club: serialize_club(@club)
    }
  end

  # POST /clubs
  def create
    @club = Club.new(club_params)

    if @club.save
      redirect_to @club, notice: "Club was successfully created."
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_club
      @club = Club.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def club_params
      params.require(:club).permit(:name)
    end

    def serialize_club(club)
      club.as_json(only: [
        :id, :name
      ])
    end
end
