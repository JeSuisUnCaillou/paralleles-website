/*
 global SVG
 global $
*/

$(document).ready(function() {
    
    if (SVG.supported) {
                
        var get_parent_horizontal_padding = function(element){
            return /^(\d+)px(\d+)px$/.exec(element.parent().css('padding-left') + element.parent().css('padding-right')).slice(1,3).reduce(function(a, b){ return parseInt(a) + parseInt(b); });
        };
        
        //get the sum of the left and right paddings of the parent element, to be able to calculate its real width
        var parent_padding = get_parent_horizontal_padding($("#canevas"));
        
        //Number of frames or twin frames displayed at once
        var nb_frames = 1;
        
        //Canevas width
        var width = $("#canevas").parent().width() - parent_padding/2; 
        //Margin between 2 frames
        var margin = 10;
        //Frame width
        var frame_width = (width - margin) / 2;
        //Frame height
        var frame_height = frame_width * 6/9;
        //Canevas height
        var height = (frame_height + margin) * nb_frames;
        //next_button height
        var button_height = frame_height / 4;
        //number of slide up of the slider group
        var nb_animate_slider = 0;
        //starting frame
        var starting_frame_paths = JSON.parse($("#starting_frame").attr("frame_paths"));
        console.log("Starting by : " + starting_frame_paths[0])
        
        //Create canevas
        var canevas = SVG('canevas').size(width, height);
        var slider = canevas.group();

        var create_frame = function(images_paths, next_frames_paths){
            var frame_group = slider.group();
            
            var y = nb_animate_slider * (frame_height + margin)
            if(images_paths.length == 1){
                var x = width/4;
                var image_group = draw_image(frame_group, images_paths[0], x, y)
                var next_button = draw_next_button(frame_group, next_frames_paths, frame_width, x, y)
            } else if(images_paths.length == 2) {
                var x = 0;
                var left_image_group = draw_image(frame_group, images_paths[0], x, y)
                var right_image_group = draw_image(frame_group, images_paths[1], x + frame_width + margin, y)
                var next_button = draw_next_button(frame_group, next_frames_paths, width, x, y)
            } else {
                console.log("Only one or two images_paths accepted. Actual length : " + images_paths.length)
            }
            
            return frame_group;
        };
        
        //Draw an image in a parent_group, at a given position
        var draw_image = function(parent_group, image_path, x, y){
            var image_group = parent_group.group();
            var rect = image_group.rect(frame_width, frame_height).attr({ fill: 'grey' }).translate(x, y);
            var frame = image_group.image(image_path, frame_width, frame_height).translate(x, y);
            return image_group;
        };
        
        //Draw a next button in a parent_group, at a given position
        var draw_next_button = function(parent_group, next_frames_paths, button_width, x, y){
            var next_button = parent_group.rect(button_width, button_height).attr({ fill: 'grey' }).addClass('hoverable').translate(x, y + frame_height - button_height)
            var next_arrow = parent_group.polyline('0,0 50,50 100,0').translate(x + frame_width / 2 - 50, y + frame_height - button_height/2 - 25).fill('none').stroke({ width: 5, color: "white" })
            
            next_button.click(function(){
                if(next_frames_paths.length == 1){
                    $.ajax({url: next_frames_paths[0], success: function(result){
                        nb_animate_slider = nb_animate_slider + 1
                        var new_x = width/4
                        var new_y = y + frame_height + margin
                        
                        create_frame(result["images_paths"], result["next_frames_paths"], new_x, new_y)
                        slider.animate(1000, ">").move(0, -1 * (frame_height + margin) * nb_animate_slider);
                    }})
                } else if(next_frames_paths.length == 2){
                    console.log("TODO")
                } else {
                    console.log("Only one or two next_frames_paths accepted. Actual length : " + next_frames_paths.length)
                }
                
            })
        }
        
        //Get the first frame
        $.ajax({url: starting_frame_paths[0], success: function(result){
            console.log(result);
            create_frame(result["images_paths"], result["next_frames_paths"]);
            //create_frame(result["next_images_src"][0], width/4, frame_height + margin)
        }});
        
        //Draw dumb frames
        // var image_1 = '/assets/webcomic/2-d26470ecc1641c7973a9cc2bcf4f0c395f95f31dec71bc847f569051faefc5fa.jpg';
        // var rect1 = create_frame(image_1, 0, 0);
        // var rect2 = create_frame(image_1, frame_width + margin, 0);
        
        // var rect3 = create_frame(image_1, 0, frame_height + margin);
        // var rect3 = create_frame(image_1, frame_width + margin, frame_height + margin);
        
    } else {
      alert('SVG not supported')
    }   

});
