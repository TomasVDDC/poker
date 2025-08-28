class PagesController < ApplicationController
  def home
    render inertia: 'Pages/Home', props: {
    }

  end
end
