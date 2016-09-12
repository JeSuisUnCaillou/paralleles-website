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
        
        //Create canevas
        var canevas = SVG('canevas').size(width, height);

        var create_rect = function(x, y, width, height){
            var rect = canevas.rect(width, height).attr({ fill: 'grey' }).translate(x, y);
            rect.click(function() {
                this.animate().move(0, -1*(frame_height + margin));
            })
            return rect;
        };
        
        //Draw dumb rectangles
        var rect1 = create_rect(0, 0, frame_width, frame_height);
        var rect2 = create_rect(frame_width + margin, 0, frame_width, frame_height);
        
        var rect3 = create_rect(0, frame_height + margin, frame_width, frame_height);
        var rect3 = create_rect(frame_width + margin, frame_height + margin, frame_width, frame_height);
        
    } else {
      alert('SVG not supported')
    }   

});
