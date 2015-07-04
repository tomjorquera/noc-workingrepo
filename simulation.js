function simulation(canvasId) {

    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    var res = {};

    res.height = canvas.height;
    res.width = canvas.width;

    res.movers = [];

    res.addMover = function(parameters) {
        this.movers.push(noc.mover(parameters));
    };

    function drawCircle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x,y, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    res.setup = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    res.draw = function() {
        this.setup();
        for(var i = 0; i < this.movers.length; i++) {
            drawCircle(this.movers[i].loc[0],
                       this.movers[i].loc[1],
                       this.movers[i].mass);
        }
    };

    res.step = function(moveFunction){
        for (var i = 0; i < this.movers.length; i++) {
            moveFunction(this.movers[i]);
            this.movers[i].update(canvas.width, canvas.height, 20);
        }
        this.draw();
    };

    return res;
}
