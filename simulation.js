'use strict';

function simulation(renderer, width, height) {

    var res = {};

    res.height = height;
    res.width = width;

    res.movers = [];

    res.paths = [];

    res.addMover = function(parameters) {
        var mover = noc.mover(parameters);
        this.movers.push(mover);
        return mover;
    };

    res.addPath = function(begin, end, radius, render) {
        var path = noc.path(begin, end, radius, render);
        this.paths.push(path);
        return path;
    };

    res.step = function(moveFunction){
        renderer.setup(width, height);

        for (var i = 0; i < this.paths.length; i++) {
            this.paths[i].render(renderer);
        }
        for (i = 0; i < this.movers.length; i++) {
            let m = this.movers[i];
            moveFunction(m);
            m.update(width, height, 20);
            m.render(renderer);
        }
    };

    return res;
}
