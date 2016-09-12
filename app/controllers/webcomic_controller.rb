class WebcomicController < ApplicationController
    include ActionView::Helpers::AssetUrlHelper
    
    def first_frame
       image = asset_url('webcomic/1.png')
       ap image
       render json: { image_path: image }
    end

end