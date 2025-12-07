class PagesController < ApplicationController
  allow_unauthenticated_access only: %i[ home ]
  is_authenticated

  def home
    logger.info "home params: #{params}"
    render inertia: 'Pages/Home', props: {
    }

  end
end
