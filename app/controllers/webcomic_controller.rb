class WebcomicController < ApplicationController
    
    def first_frame
       image =  Webcomic.new.frames.first
       render json: image
    end

end