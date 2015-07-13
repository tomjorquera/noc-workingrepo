function render(canvasId, simulation) {
    var canvas = document.getElementById(canvasId);

    var ctx = canvas.getContext('2d');

    function drawCircle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x,y, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    function drawTriangle(x,y,radius, rotation = 0) {
        ctx.fillStyle = 'blue';

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
    }

    return {
        canvas,
        setup: function() {
            // change canvas size according to simulation
            canvas.width = simulation.width;
            canvas.height = simulation.height;
            // clean canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
        draw: function() {
            this.setup();
            for(var i = 0; i < simulation.movers.length; i++) {
                drawTriangle(simulation.movers[i].loc[0],
                             simulation.movers[i].loc[1],
                             simulation.movers[i].mass,
                             simulation.movers[i].angle);
            }
        }
    };
}
