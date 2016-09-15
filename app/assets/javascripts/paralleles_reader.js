/*
 global SVG
 global $
 global Image
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
        //number of slide up with frame creation of the slider group
        var nb_slider_up = 0;
        //number of slide down of the slider group, without frame creation
        var nb_slider_down = 0;
        //number of slide right of the slider group
        var nb_slider_right = 0;
        
        //starting frame
        var starting_frame_paths = JSON.parse($("#starting_frame").attr("frame_paths"));
        console.log("Starting by : " + starting_frame_paths[0])
        
        //Create canevas
        var canevas = SVG('canevas').size(width, height);
        var slider = canevas.group();

        var create_frame = function(images_paths, next_images_paths, next_frames_paths, left_slide){
            var frame_group = slider.group();
            var y = nb_slider_up * (frame_height + margin)
            var x = -1 * nb_slider_right * (frame_width + margin) / 2
            
            if(images_paths.length == 1){
                x = x + width/4;
                var image_group = draw_image(frame_group, images_paths[0], next_images_paths, x, y)
                var next_button = draw_next_button(frame_group, next_frames_paths, frame_width, x, y, 0)
                var prev_button = draw_prev_button(frame_group, frame_width, x, y, left_slide)
            } else if(images_paths.length == 2) {
                var left_images_paths = images_paths[0]
                var right_images_paths = images_paths[1]
                var left_next_frames_paths = next_frames_paths[0]
                var right_next_frames_paths = next_frames_paths[1]
                var prev_button_width = width;
                var x_prev_button = x
                var x_next_button = x
                
                //Draws the left image
                if(left_images_paths != undefined){
                    var left_x = x
                    if(right_images_paths == undefined){ 
                        x_prev_button = left_x
                        x_next_button = x
                    }
                    var left_image_group = draw_image(frame_group, left_images_paths, next_images_paths, left_x, y)

                } else {
                    prev_button_width = frame_width;
                }
                //Draws the right image
                if(right_images_paths != undefined){
                    if(left_images_paths == undefined){
                        x_prev_button = right_x
                        x_next_button = x + frame_width + margin
                    }
                    var right_x = x + frame_width + margin
                    var right_image_group = draw_image(frame_group, right_images_paths, next_images_paths, right_x, y)
                } else {
                    prev_button_width = frame_width;
                }
                
                //Draws the next button(s)
                if(left_next_frames_paths.length > 0 && right_next_frames_paths.length > 0){
                    //One next button
                    var next_button = draw_next_button(frame_group, next_frames_paths, width, x_next_button, y, 0)
                } else {
                    //Two next buttons, with one dumb
                    var x_dumb_button = x
                    var right_slide = 0
                    if(left_next_frames_paths.length == 0){
                        var frames_paths = right_next_frames_paths
                        x_dumb_button = x
                        x_next_button = x + frame_width + margin
                        right_slide = -1
                    } else if (right_next_frames_paths.length == 0){
                        var frames_paths = left_next_frames_paths
                        x_dumb_button = x + frame_width + margin
                        x_next_button = x
                        right_slide = 1
                    }
                    var next_button = draw_next_button(frame_group, frames_paths, frame_width, x_next_button, y, right_slide)
                    var dumb_button = draw_dumb_button(frame_group, frame_width, x_dumb_button, y)
                }
                //Draws the prev button
                console.log(left_slide)
                var prev_button = draw_prev_button(frame_group, prev_button_width, x_prev_button, y, left_slide)
                
            } else {
                console.log("Only one or two images_paths accepted. Actual length : " + images_paths.length)
            }
            
            return frame_group;
        };
        
        //Draw an image in a parent_group, at a given position
        var draw_image = function(parent_group, image_path, next_images_paths, x, y){
            //Do not draw the image if there is no image_path
            //if(image_path == undefined){ return null; }
            
            var image_group = parent_group.group();
            var rect = image_group.rect(frame_width, frame_height).attr({ fill: 'grey' }).translate(x, y);
            var frame = image_group.image(image_path, frame_width, frame_height).translate(x, y);
            preload(flatten(next_images_paths));
            return image_group;
        };
        
        //Draw a next button in a parent_group, at a given position
        var draw_prev_button = function(parent_group, button_width, x, y, left_slide){
            //Do not create a prev button if we havent moved up the slider (aka : for the first frame)
            if(nb_slider_up == 0){ return null; }
            var prev_button = parent_group.rect(button_width, button_height).attr({ fill: 'grey' }).addClass('hoverable').translate(x, y)
            var prev_arrow = parent_group.polyline('0,50 50,0 100,50').translate(x + button_width / 2 - 50, y + button_height/2 - 25).fill('none').stroke({ width: 5, color: "blue" })
            
            prev_button.click(function(){
                nb_slider_down = nb_slider_down + 1
                nb_slider_right = nb_slider_right - left_slide
                var with_movement = (left_slide != 0)
                make_it_slide(with_movement)
            })
        }
        
        //Draw a dumb button for frames with no next
        var draw_dumb_button = function(parent_group, button_width, x, y){
            var next_button = parent_group.rect(button_width, button_height).attr({ fill: 'grey' }).addClass('hoverable').translate(x, y + frame_height - button_height)
            var next_arrow = parent_group.polyline('0,0 50,50 100,0').translate(x + button_width / 2 - 50, y + frame_height - button_height/2 - 25).fill('none').stroke({ width: 5, color: "red" })
        }
        
        //Draw a next button in a parent_group, at a given position
        var draw_next_button = function(parent_group, next_frames_paths, button_width, x, y, right_slide){
            //Do not create a next button if next_frames_paths is empty
            //console.log(JSON.stringify(right_slide))
            if(next_frames_paths == [undefined, undefined] || next_frames_paths.length == 0){ return null; }
            
            var next_button = parent_group.rect(button_width, button_height).attr({ fill: 'grey' }).addClass('hoverable').translate(x, y + frame_height - button_height)
            var next_arrow = parent_group.polyline('0,0 50,50 100,0').translate(x + button_width / 2 - 50, y + frame_height - button_height/2 - 25).fill('none').stroke({ width: 5, color: "blue" })
            var with_movement = (right_slide != 0)
            
            next_button.click(function(){
                //If we have already moved down the slider, just move it up without creating a next frame
                if(nb_slider_down > 0){
                    nb_slider_down = nb_slider_down - 1
                    nb_slider_right = nb_slider_right + right_slide
                    make_it_slide(with_movement)
                    return null;
                }
                //Otherwise, fetch and create the next frame before sliding up
                if(next_frames_paths.length == 1){
                    nb_slider_up = nb_slider_up + 1
                    nb_slider_right = nb_slider_right + right_slide
                    $.ajax({url: next_frames_paths[0], success: function(result){
                        //create the frame
                        create_frame(result["images_paths"], result["next_images_paths"], result["next_frames_paths"], right_slide)
                        //move up the slider
                        make_it_slide(with_movement)
                    }, error: function(){
                        nb_slider_up = nb_slider_up - 1
                        nb_slider_right = nb_slider_right - right_slide
                    }})
                } else if(next_frames_paths.length == 2){
                    nb_slider_up = nb_slider_up + 1
                    nb_slider_right = nb_slider_right + right_slide
                    var left_frames_paths = next_frames_paths[0]
                    var right_frames_paths = next_frames_paths[1]
                    
                    //get left image
                    $.ajax({url: left_frames_paths, success: function(result){
                        var left_images_paths = result["images_paths"]
                        var left_next_frames_paths = result["next_frames_paths"]
                        var left_next_images_paths = result["next_images_paths"]
                        //get right image
                        $.ajax({url: right_frames_paths, success: function(result){
                            var right_images_paths = result["images_paths"]
                            var right_next_frames_paths = result["next_frames_paths"]
                            var right_next_images_paths = result["next_images_paths"]
                            //create the frame
                            create_frame([left_images_paths, right_images_paths], left_next_images_paths.concat(right_next_images_paths), [left_next_frames_paths, right_next_frames_paths], right_slide)
                            //move up the slider
                            make_it_slide(with_movement)
                        }, error: function(){
                            nb_slider_up = nb_slider_up - 1
                            nb_slider_right = nb_slider_right - right_slide
                        }})
                    }, error: function(){
                        nb_slider_up = nb_slider_up - 1
                        nb_slider_right = nb_slider_right - right_slide
                    }})
                    
                } else {
                    console.log("Only one or two next_frames_paths accepted. Actual length : " + next_frames_paths.length)
                }
                
            })
        }
        
        //slides the slider group up one time
        var make_it_slide = function(with_movement){
            var x = nb_slider_right * (frame_width + margin) / 2
            var y = -1 * (frame_height + margin) * (nb_slider_up - nb_slider_down)
            if(with_movement){
                slider.animate(500, ">").move(x, y);
            } else {
                slider.move(x, y);
            }
        }
        
        //preloads the images
        var preload = function(images_paths){
            for (var i = 0; i < images_paths.length; i++) {
				var img = new Image()
				img.src = images_paths[i]
			}
        }
        
        //flattens an array
        var flatten = function(ary) {
            var ret = [];
            for(var i = 0; i < ary.length; i++) {
                if(Array.isArray(ary[i])) {
                    ret = ret.concat(flatten(ary[i]));
                } else {
                    ret.push(ary[i]);
                }
            }
            return ret;
        }
        
        //Get the first frame
        $.ajax({url: starting_frame_paths[0], success: function(result){
            console.log(result);
            create_frame(result["images_paths"], result["next_images_paths"], result["next_frames_paths"], 0);
        }});
        
    } else {
      alert('SVG not supported')
    }   

});
