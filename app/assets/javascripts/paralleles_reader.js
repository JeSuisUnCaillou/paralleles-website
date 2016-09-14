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
        var nb_frames = 2;
        
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
        
        //Create canevas
        var canevas = SVG('canevas').size(width, height);
        var slider = canevas.group();

        var create_frame = function(images_paths, next_frames_paths, x, y){
            var image_path = images_paths[0];
            var frame_group = slider.group();
            var rect = frame_group.rect(frame_width, frame_height).attr({ fill: 'grey' }).translate(x, y);
            var frame = frame_group.image(image_path, frame_width, frame_height).translate(x, y).attr({image_path: image_path});
            var next_button = frame_group.rect(frame_width, button_height).attr({ fill: 'grey' }).addClass('hoverable').translate(x, y + frame_height - button_height)
            var next_arrow = frame_group.polyline('0,0 50,50 100,0').translate(x + frame_width / 2 - 50, y + frame_height - button_height/2 - 25).fill('none').stroke({ width: 5, color: "white" })
            
            next_button.click(function(){
                nb_frames = next_frames_paths.length;
                next_frames_paths.forEach(function(next_frame_path, index){
                    $.ajax({url: next_frame_path, success: function(result){
                        var x = nb_frames == 1 ? width/4 : (index == 0 ? 0 : frame_width + margin)
                        create_frame(result["images_paths"], result["next_frames_paths"], x, nb_animate_slider * (frame_height + margin));
                    }});
                })
                
                nb_animate_slider = nb_animate_slider + 1;
                slider.animate(100).move(0, -1 * (frame_height + margin) * nb_animate_slider);
            });
            return frame;
        };
        
        //Get the first frame
        $.ajax({url: "first_frame", success: function(result){
            console.log(result);
            create_frame(result["images_paths"], result["next_frames_paths"], width/4, 0);
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
