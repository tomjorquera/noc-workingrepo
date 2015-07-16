function render(canvasId) {

    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    return {
        canvas,
        drawCircle: function(x, y, radius, fillColor, strokeColor) {
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;

            ctx.beginPath();
            ctx.arc(x,y, radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        },
        drawTriangle: function(
            x,
            y,
            radius,
            fillColor,
            strokeColor,
            rotation = 0
        ) {
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;

            // draw lines between vertices
            let path = new Path2D();

            let top = [x + radius * Math.cos(rotation),
                       y + radius * Math.sin(rotation)];
            path.moveTo(top[0], top[1]);

            path.lineTo(x + radius * Math.cos(Math.PI * 2/3 + rotation),
                        y + radius * Math.sin(Math.PI * 2/3 + rotation));

            path.lineTo(x + radius * Math.cos(Math.PI * 4/3 + rotation),
                        y + radius * Math.sin(Math.PI * 4/3 + rotation));

            path.lineTo(top[0], top[1]);

            ctx.fill(path);
        },
        setup: function(width, height) {
            // change canvas size according to new dimentions
            // note: this also clear the canvas
            canvas.width = width;
            canvas.height = height;

            // adjust between coordinate systems
            ctx.save();
            ctx.scale(1, -1);       // Zoom in and flip y
        }
    };
}
