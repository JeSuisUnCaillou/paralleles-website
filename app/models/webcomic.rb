class Webcomic
    def images_paths
        Dir.glob("app/assets/images/webcomic/**/*").map{ |s| s.gsub("app/assets/images/", '') }.sort
    end
    
    def frames
        paths = images_paths
        paths.map.with_index do |path, index| 
            next_path = paths[index + 1]
            Frame.new(path, next_path)
        end
    end
    
end