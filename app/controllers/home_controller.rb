class HomeController < ApplicationController
   def home
      ids = params[:ids].try(:split, "|")
      if ids.present?
         @starting_frames = ids.map{ |i| Frame.new(i) }
      else
         @starting_frames = [Frame.first_frame]
      end
   end
    
end