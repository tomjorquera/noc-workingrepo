'use strict';

function simulation(renderer, width, height) {

    var res = {};

    res.height = height;
    res.width = width;

    res.movers = [];

    res.addMover = function(parameters) {
        this.movers.push(noc.mover(parameters));
    };


    res.step = function(moveFunction){
        renderer.setup(width, height);
        for (var i = 0; i < this.movers.length; i++) {
            let m = this.movers[i];
            moveFunction(m);
            m.update(width, height, 20);
            m.render(renderer);
        }
    };

    return res;
}
