function intro(canvasId) {
    return {
        canvas : document.getElementById(canvasId),
        ctx : canvas.getContext('2d'),
        walker : function() {
            return {
                x : canvas.height/2,
                y : canvas.width/2,
                step : function() {
                    var stepx = Math.random() * 2.5 -1;
                    var stepy = Math.random() * 2.5 -1;
                    this.x = this.x + stepx;
                    this.y = this.y + stepy;
                }
            };
        },
        display : function(walker) {
            this.ctx.fillRect(walker.x, walker.y, 1, 1);
        }
    };
}
