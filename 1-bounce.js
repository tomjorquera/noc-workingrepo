function bounce(canvasId) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    var res = {
        xy: vec2.fromValues(100, 100),
        speed: vec2.fromValues(1, 3.3)
    };

    res.setup = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    res.move = function() {
        vec2.add(this.xy, this.xy, this.speed);

        if ((this.xy[0] > canvas.width) || (this.xy[0] < 0)) {
            this.speed = vec2.fromValues(this.speed[0] * -1, this.speed[1]);
        }
        if ((this.xy[1] > canvas.height) || (this.xy[1] < 0)) {
            this.speed = vec2.fromValues(this.speed[0], this.speed[1] * -1);
        }

    };

    function drawCircle(x,y) {
        ctx.beginPath();
        ctx.arc(x,y, 16, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    res.draw = function() {

        this.setup();
        drawCircle(this.xy[0], this.xy[1]);
    };

    res.step = function() {
        this.move();
        this.draw();
    };

    return res;
}
