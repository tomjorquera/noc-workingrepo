function bounce(canvasId) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    var res = {
        x: 100, y: 100,
        xspeed: 1, yspeed : 3.3
    };

    res.setup = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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

        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;

        if ((this.x > canvas.width) || (this.x < 0)) {
            this.xspeed = this.xspeed * -1;
        }
        if ((this.y > canvas.height) || (this.y < 0)) {
            this.yspeed = this.yspeed * -1;
        }

        drawCircle(this.x, this.y);
    };

    return res;
}
