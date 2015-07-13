function render(canvasId) {

    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    // monitor mouse position
    let mousePosition = vec2.fromValues(0, 0);
    canvas.onmousemove = (evt) => {
        let rect = canvas.getBoundingClientRect();

        mousePosition =  vec2.fromValues(
            (evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
            (evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
    };

    return {
        canvas,
        drawCircle: function(x, y, radius, alpha = 1) {
            ctx.fillStyle = 'rgba(0,0,255,' + alpha + ')';
            ctx.strokeStyle = 'rgba(0,0,0,' + alpha + ')';

            ctx.beginPath();
            ctx.arc(x,y, radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        },
        drawTriangle: function(x,y,radius,alpha = 1, rotation = 0) {
            ctx.fillStyle = 'rgba(0,0,255,' + alpha + ')';

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
            canvas.width = width;
            canvas.height = height;
            // clean canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
        mousePos: () => mousePosition
    };
}
