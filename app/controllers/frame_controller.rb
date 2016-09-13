class FrameController < ApplicationController
    
    before_action :set_frame, only: [:show]
    
    def first_frame
       image =  Frame.first_frame
       render json: image
    end
    
    def show
       render json: {test: "test ok"} 
    end
    
    private
    
        def set_frame
           #TODO
        end

end