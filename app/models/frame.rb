class Frame
    attr_accessor :ids, :images_paths#, :next_images_src
    
    #Creates a new frame by finding it by its ids (one or two)
    #Frames ids are like this : "left/right/21" and it fetches the following frame app/assets/images/webcomic/left/right/21.jpg
    #Files must be organised as following. The files names don't matter, the frame will always reference the next ones in its attributes
    #
    # webcomic/
    #  1.jpg
    #  2.jpg
    #  3.jpg
    #  left/
    #    4.jpg
    #    5.jpg
    #  right/
    #    4.1.jpg
    #    4.2.jpg
    #    left/
    #      ...
    #    right/
    #      ...
    def initialize(*ids_string)
        raise ArgumentError.new("only one or two images per frame") if ids_string.empty? || ids_string.length > 2
        @ids = ids_string
        @images_paths = @ids.map{ |id| 
            raise ArgumentError.new("Wrong image id : #{id}") if Dir.glob("app/assets/images/webcomic/#{id}.jpg").empty?
            real_asset_path("webcomic/#{id}.jpg")
        }
        
    end
    
    def self.first_frame
       Frame.new("1") 
    end
    
    # def initialize(image_path, next_images_paths)
    #     self.image_src = real_asset_path(image_path)
    #     next_images_paths = [next_images_paths] unless next_images_paths.is_a? Array
    #     self.next_images_src = next_images_paths.map{ |path| real_asset_path(path)}
    # end
    
    def real_asset_path(image_path)
        image_path.present? ? ActionController::Base.helpers.asset_path(image_path) : ""
    end
    
    # Lists all images paths in the folder app/assets/images/webcomic/
    def self.images_paths
        Dir.glob("app/assets/images/webcomic/**/*").map{ |s| s.gsub("app/assets/images/", '') }.sort
    end

end