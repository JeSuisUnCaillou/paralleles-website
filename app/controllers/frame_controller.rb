class FrameController < ApplicationController
    
    before_action :set_frame, only: [:show]
    
    def first_frame
       render json: Frame.first_frame
    end
    
    def show
       render json: @frame
    end
    
    private
    
        def set_frame
           @frame = Frame.new(frame_params[:id])
        end

        def frame_params
           params.permit(:id)
        end
end