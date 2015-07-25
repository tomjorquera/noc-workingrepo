'use strict';

function application(sim, renderer, mouse) {

    let path = sim.addPath (
        vec2.fromValues(70, 70),
        vec2.fromValues(550, 150),
        10
    );

    let nbMovers = 5;
    for(let i = 0; i < nbMovers; i++) {
        sim.addMover({
            mass:5,
            loc:vec2.fromValues(
                Math.random() * sim.width,
                Math.random() * sim.height
            )
        });

        sim.movers[i].vel = vec2.fromValues(1, 1);
    }

    return {
        step: function(mover) {
            mover.subjectTo(noc.forces.followPath(path, 30, 10, 8, 0));
        }
    };
}
