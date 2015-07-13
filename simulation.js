'use strict';

function simulation(width, height) {

    var res = {};

    res.height = height;
    res.width = width;

    res.movers = [];

    res.addMover = function(parameters) {
        this.movers.push(noc.mover(parameters));
    };


    res.step = function(moveFunction){
        for (var i = 0; i < this.movers.length; i++) {
            moveFunction(this.movers[i]);
            this.movers[i].update(width, height, 20);
        }
    };

    return res;
}
