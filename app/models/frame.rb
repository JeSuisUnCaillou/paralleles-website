class Frame
    WEBCOMIC_PATH = "app/assets/images/webcomic/"
    EXTENSION = ".jpg"
    
    attr_accessor :ids, :images_paths, :next_ids, :next_frames_paths
    
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
    #
    def initialize(*ids_string)
        raise ArgumentError.new("only one or two images per frame") if ids_string.empty? || ids_string.length > 2
        @ids = ids_string.map{ |id|
            id = "#{id}#{EXTENSION}" if id !~ /#{EXTENSION}$/
            id
        }
        @images_paths = @ids.map{ |id|
            raise ArgumentError.new("Wrong image id : #{id}") if Frame.images_paths(id).empty?
            id_to_image_path(id)
        }
        @next_ids = Frame.get_next_images_ids(@ids.first)
        @next_frames_paths = @next_ids.map{ |id|
             "frame/#{id}"
        }
    end

    #converts an id like "left/22.jpg" into its asset path
    def id_to_image_path(id)
        raise ArgumentError.new("Id must be present") if id.blank?
        image_path = "webcomic/#{id}"
        ActionController::Base.helpers.asset_path(image_path)
    end
    
    #Gets the ids of the next images in the image tree
    def self.get_next_images_ids(id)
        folder = id.gsub(/(^[^\/]+|\/[^\/]+?)$/, '/') #gets the folders part in a string like 'right/left/35'
        images_paths = Frame.images_paths(folder)
        position = images_paths.find_index(id)
        raise ArgumentError.new("Bad image id") if position.nil?
        if position + 1 <= images_paths.length - 1
            next_paths = [images_paths[position + 1]]
        else
            next_paths = [Frame.images_paths("left/").first, Frame.images_paths("right/").first]
        end
        return next_paths
    end
    
        
    def self.first_frame
       Frame.new("1.jpg")
    end
    
    # Lists all images paths in the folder app/assets/images/webcomic/#{folder}
    # folder can be a file too, to check if it exist
    def self.images_paths(folder="")
        folder = '' if folder == "/"
        folder += "*" if folder !~ /#{EXTENSION}$/
        Dir.glob("#{WEBCOMIC_PATH}#{folder}").map{ |s| s.gsub(WEBCOMIC_PATH, '') }.sort{ |x, y|
            x = x.gsub(/#{EXTENSION}$/, '').gsub(/[^\.\d]/, '').to_i
            y = y.gsub(/#{EXTENSION}$/, '').gsub(/[^\.\d]/, '').to_i
            x <=> y
        }
    end


end