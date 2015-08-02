function pareto(canvasId) {

    noise.seed(Math.random());

    var canvas = document.getElementById(canvasId);
    var ctx = this.canvas.getContext('2d');
    var height = canvas.height;
    var width = canvas.width;

    var image = ctx.createImageData(width, height);
    var data = image.data;

    var scale = function(x, min, max, a,b) {
        return (b - a) * (x - min)/(max - min) + a;
    };

    for(var x = 0; x < width; x++) {
        for(var y = 0; y < height; y++) {
            var bright = Math.abs(noise.perlin2(x/100,y/100)) * 256;
            var cell = (x + y * canvas.width) * 4;
            data[cell] = data[cell + 1] = data[cell + 2] = bright;
            data[cell + 3] = 255; // alpha
        }
    }

    ctx.fillColor = 'black';
    ctx.fillRect(0, 0, 100, 100);
    ctx.putImageData(image, 0, 0);

}
