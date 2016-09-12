$(document).ready(function() {
    
    if (SVG.supported) {
        
        //get the sum of the left and right paddings of the parent element
        var parent_padding = /^(\d+)px(\d+)px$/.exec($("#canevas").parent().css('padding-left') + $("#canevas").parent().css('padding-right')).slice(1,3).reduce(function(a, b){ return parseInt(a) + parseInt(b); });
        

        var x_size = $("#canevas").parent().width() - parent_padding/2; 
        console.log($("#canevas").parent().width());
        console.log(x_size);
        //Margin between 2 frames
        var margin = 10;
        //Frame width
        var frame_x_size = (x_size - margin) / 2.0;
        //Frame height
        var frame_y_size = frame_x_size * 6.0/9.0;
        //Canevas height
        var y_size = frame_y_size * 2;
        
        //Create canevas
        var canevas = SVG('canevas').size(x_size, y_size);
        
        //Draw dumb rectangle
        var rect1 = canevas.rect(frame_x_size, frame_y_size).attr({ fill: '#f06' });
        var rect2 = canevas.rect(frame_x_size, frame_y_size).attr({ fill: '#bbb' }).translate(frame_x_size + margin, 0);
        
    } else {
      alert('SVG not supported')
    }   

});