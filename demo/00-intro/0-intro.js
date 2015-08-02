function intro(canvasId) {
    var res = {
        canvas : document.getElementById(canvasId),
        ctx : this.canvas.getContext('2d'),
        walker : function() {
            return {
                x : this.canvas.height/2,
                y : this.canvas.width/2,
                step : function() {
                    var biasx = this.x > res.mousepos.x ? -0.5 : 0.5;
                    var biasy = this.y > res.mousepos.y ? -0.5 : 0.5;

                    var stepx = Math.random() * 2 -1 +biasx;
                    var stepy = Math.random() * 2 -1 +biasy;
                    this.x = this.x + stepx;
                    this.y = this.y + stepy;
                }
            };
        },
        display : function(walker) {
            this.ctx.fillRect(walker.x, walker.y, 1, 1);
        },
        mousepos : {x:0, y:0}
    };

    res.canvas.onmousemove = function(evt) {
        var rect = res.canvas.getBoundingClientRect();
        res.mousepos = {
            x: (evt.clientX-rect.left)/(rect.right-rect.left)*res.canvas.width,
            y: (evt.clientY-rect.top)/(rect.bottom-rect.top)*res.canvas.height};
    };

    return res;
}
