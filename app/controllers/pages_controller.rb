class PagesController < ApplicationController
  allow_unauthenticated_access only: %i[ home ]
  def home
    render inertia: 'Pages/Home', props: {
    }

  end
end
