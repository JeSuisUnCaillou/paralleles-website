class HomeController < ApplicationController
   def home
      ids = params[:ids]
      @starting_frame = ids.present? ? Frame.new(ids) : Frame.first_frame
   end
    
end