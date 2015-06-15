function forces(canvasId) {

    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    var res = {};

    res.movers = [];
    for(var i = 0; i < 100; i++) {
        res.movers[i] = noc.mover({
            loc: vec2.fromValues(
                Math.random() * canvas.width,
                Math.random() * canvas.height),
            mass: Math.random() * 15,
            wrapping: i < 50 });
    }

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

    res.step = function(){
        for (var i = 0; i < this.movers.length; i++) {
            this.movers[i].applyForce(vec2.fromValues(0.1, 0.1));
            this.movers[i].update(canvas.width, canvas.height);
        }
        this.draw();
    };

    return res;
}
