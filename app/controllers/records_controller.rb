# The history of a club's single-session records (biggest win, biggest loss),
# reached by clicking the matching stat tile on the club page.
class RecordsController < ApplicationController
  allow_unauthenticated_access only: %i[ shared ]

  RECORDS = %w[ biggest_win biggest_loss ].freeze

  before_action :set_record

  # GET /clubs/1/records/biggest_win
  def show
    @club = Club.find(params[:club_id])
    render inertia: "Record/Show", props: record_props.merge(read_only: false)
  end

  # GET /clubs/shared/:share_token/records/biggest_win
  def shared
    @club = Club.find_by!(share_token: params[:share_token])
    render inertia: "Record/Show", props: record_props.merge(
      read_only: true,
      share_token: params[:share_token]
    )
  end

  private
    def set_record
      @record = params[:record]
      raise ActionController::RoutingError, "Unknown record" unless RECORDS.include?(@record)
    end

    def record_props
      chart_data = create_chart(@club)
      {
        club: @club.as_json(only: [ :id, :name, :currency ]),
        record: @record,
        chart_data: chart_data,
        stats: create_stats(chart_data)
      }
    end

    # One point per game holding the record up to and including that game, and
    # who set it. The record only exists once someone has actually won (or
    # lost), so early games are left out of the line until then.
    def create_chart(club)
      holder = nil
      beats = @record == "biggest_win" ? ->(a, b) { a > b } : ->(a, b) { a < b }

      club.games.includes(player_sessions: :player).map do |game|
        game.player_sessions.each do |session|
          profit = session.net_profit
          next unless beats.call(profit, 0)
          holder = session if holder.nil? || beats.call(profit, holder.net_profit)
        end

        data_point = { "date" => game.date }
        if holder
          data_point[@record] = holder.net_profit.to_f
          data_point["player"] = holder.player.name
        end
        data_point
      end
    end

    def create_stats(chart_data)
      set = chart_data.select { |point| point.key?(@record) }
      current = set.last
      {
        "player_name" => current&.dig("player"),
        "amount" => current && number_to_currency(current[@record], unit: @club.currency),
        # How many times the record was set or broken.
        "times_broken" => set.each_cons(2).count { |a, b| a[@record] != b[@record] } + (set.any? ? 1 : 0)
      }
    end
end
