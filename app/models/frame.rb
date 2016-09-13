class Frame
    WEBCOMIC_PATH = "app/assets/images/webcomic/"
    EXTENSION = ".jpg"
    
    attr_accessor :ids, :images_paths, :next_ids
    
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
            raise ArgumentError.new("Wrong image id : #{id}") if Frame.images_paths("#{id}#{EXTENSION}").empty?
            real_asset_path("webcomic/#{id}.jpg")
        }
        
    end

    
    # def initialize(image_path, next_images_paths)
    #     self.image_src = real_asset_path(image_path)
    #     next_images_paths = [next_images_paths] unless next_images_paths.is_a? Array
    #     self.next_images_src = next_images_paths.map{ |path| real_asset_path(path)}
    # end
    
    def real_asset_path(image_path)
        image_path.present? ? ActionController::Base.helpers.asset_path(image_path) : ""
    end
    
    def self.get_next_images_paths(id)
        folder = id.gsub(/(^[^\/]+|\/[^\/]+?)$/, '/')
        folder = '' if folder == "/"
        images_paths = Frame.images_paths(folder)
        position = images_paths.find_index(id)
        raise ArgumentError.new("Bad image id") if position.nil?
        next_image_path = images_paths[position + 1]
        return next_image_path
    end
    
        
    def self.first_frame
       Frame.new("1") 
    end
    
    # Lists all images paths in the folder app/assets/images/webcomic/#{folder}
    # folder can be a file too, to check if it exist
    def self.images_paths(folder="")
        folder += "*" if folder !~ /#{EXTENSION}$/
        Dir.glob("#{WEBCOMIC_PATH}#{folder}").map{ |s| s.gsub(WEBCOMIC_PATH, '') }.sort{ |x, y|
            x = x.gsub(/#{EXTENSION}$/, '').gsub(/[^\.\d]/, '').to_i
            y = y.gsub(/#{EXTENSION}$/, '').gsub(/[^\.\d]/, '').to_i
            x <=> y
        }
    end

end