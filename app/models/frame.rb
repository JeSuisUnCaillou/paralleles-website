class Frame
    attr_accessor :image_src, :next_images_src
    
    def initialize(image_path, next_images_paths)
        self.image_src = real_asset_path(image_path)
        next_images_paths = [next_images_paths] unless next_images_paths.is_a? Array
        self.next_images_src = next_images_paths.map{ |path| real_asset_path(path)}
    end
    
    def real_asset_path(image_path)
        image_path.present? ? ActionController::Base.helpers.asset_path(image_path) : ""
    end

end