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
                drawCircle(simulation.movers[i].loc[0],
                           simulation.movers[i].loc[1],
                           simulation.movers[i].mass);
            }
        }
    };
}
