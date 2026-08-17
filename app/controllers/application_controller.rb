class ApplicationController < ActionController::Base
  include Authentication
  # Controllers format money into props themselves, so they all need this.
  include ActionView::Helpers::NumberHelper
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern
end
