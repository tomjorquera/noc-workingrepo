function intro(canvasId) {
    return {
        canvas : document.getElementById(canvasId),
        ctx : canvas.getContext('2d'),
        walker : function() {
            return {
                x : canvas.height/2,
                y : canvas.width/2,
                step : function() {
                    var choice = Math.floor(Math.random()*4);
                    switch(choice) {
                    case 0:
                        this.x++;
                        break;
                    case 1:
                        this.x--;
                        break;
                    case 2:
                        this.y++;
                        break;
                    case 3:
                        this.y--;
                        break;
                    }
                }
            };
        },
        display : function(walker) {
            this.ctx.fillRect(walker.x, walker.y, 1, 1);
        }
    };
}
