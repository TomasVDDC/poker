class UsersController < ApplicationController
  allow_unauthenticated_access only: %i[create]

  # POST /users
  def create
    logger.info "Params create #{params}"
    @user = User.create!(user_params)

    if @user.save
      redirect_to clubs_path(), notice: "User was successfully created."
    else
      redirect_to pages_home_path(), inertia: { errors: @user.errors }
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    # def set_player
    #   @player = Player.find(params[:id])
    # end

    # def set_club
    #   @club = Club.find(params[:club_id])
    # end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:email_address,:password)
    end

    # def serialize_player(player)
    #   player.as_json(only: [
    #     :id,:club_id, :name
    #   ])
    # end

    # def serialize_club(club)
    #   club.as_json(only: [
    #     :id
    #   ])
    # end

    # def serialize_game(game)
    #   game.as_json(only: [
    #     :id
    #   ])
    # end
end
