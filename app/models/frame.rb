class Frame
    WEBCOMIC_PATH = "app/assets/images/webcomic/"
    EXTENSION = ".jpg"
    
    attr_accessor :ids, :images_paths, :frame_paths, :next_ids, :next_images_paths, :next_frames_paths
    
    #Creates a new frame by finding it by its ids (one or two)
    #Frames ids are like this : "left/right/21" or "left;right;21.jpg" and it fetches the following frame app/assets/images/webcomic/left/right/21.jpg
    #If frames ids have some '/' and '.', it will replace them by some ';' and ','
    #Files must be organised as following. The files names don't matter, the frame will always reference the next ones in its attributes
    #
    # webcomic/
    #  1.jpg
    #  2a.jpg
    #  2b.jpg
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
        raise ArgumentError.new("only one or two images per frame") if ids_string.length > 2
        if ids_string.blank?
           @ids = [] 
           @images_paths = []
           @frame_paths = []
           @next_ids = []
           @next_images_paths = []
           @next_frames_paths = []
        else
            @ids = ids_string.map{ |id|
                id = "#{id}#{EXTENSION}" if id !~ /#{EXTENSION}$/
                id.gsub(';', '/').gsub(',', '.')
            }
            @images_paths = @ids.map{ |id| id_to_image_path(id) }
            @frame_paths = @ids.map{ |id| id_to_frame_path(id) }
            
            @next_ids = @ids.map{|id| Frame.get_next_images_ids(id) }.inject(:+)
            @next_images_paths = @next_ids.map{ |id| id_to_image_path(id) }
            @next_frames_paths = @next_ids.map{ |id| id_to_frame_path(id) }
        end
    end

    #converts an id like "left/22.jpg" into its asset path
    def id_to_image_path(id)
        return nil if id.blank?
        raise ArgumentError.new("Wrong image id : #{id}") if Frame.images_paths(id).empty?
        image_path = "webcomic/#{id}"
        ActionController::Base.helpers.asset_path(image_path)
    end
    
    #converts an id like "left/22.jpg" into its frame path
    def id_to_frame_path(id)
        return nil if id.blank?
        "frame/#{id.gsub('/', ';').gsub('.', ',')}"
    end
    
    #Gets the ids of the next images in the image tree
    def self.get_next_images_ids(id)
        return [] if id.blank?
        
        folder = "/".in?(id) ? id.gsub(/(^[^\/]+|\/[^\/]+?)$/, '/') : "" #gets the folders part in a string like 'right/left/35'
        images_paths = Frame.images_paths(folder)
        position = images_paths.find_index(id)
        raise ArgumentError.new("Bad image id") if position.nil?
        if position + 1 <= images_paths.length - 1
            next_paths = [images_paths[position + 1]]
        else
            next_paths = [Frame.images_paths("#{folder}left/", no_folder: true).first, Frame.images_paths("#{folder}right/", no_folder: true).first]
            next_paths = [] if next_paths == [nil, nil] #If there is no more left/ and right/ subfolder, return an empty array
        end
        return next_paths
    end
    
    #Gets the first frame
    def self.first_frame
       Frame.new("1.jpg")
    end
    
    # Lists all images paths in the folder app/assets/images/webcomic/#{folder}
    # folder can be a file too, to check if it exist
    def self.images_paths(folder="", **args)
        folder = '' if folder == "/"
        folder += "*" if folder !~ /#{EXTENSION}$/
        filenames = Dir.glob("#{WEBCOMIC_PATH}#{folder}")
        
        if args[:no_folder]
            filenames.keep_if{|f| File.file?(f) }
        end
        
        filenames.map{ |s| s.gsub(WEBCOMIC_PATH, '') }.sort{ |x, y|
            x = x.gsub(/#{EXTENSION}$/, '').gsub(/[^\.\d]/, '').to_f
            y = y.gsub(/#{EXTENSION}$/, '').gsub(/[^\.\d]/, '').to_f
            x <=> y
        }
    end


end