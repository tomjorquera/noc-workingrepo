'use strict';

function application(sim, renderer, mouse) {

    let path = sim.addPath (
        vec2.fromValues(70, 70),
        vec2.fromValues(550, 150),
        10
    );

    let nbPoints = 3;
    for(let i = 0; i < nbPoints; i++) {
        path.points.push(
            vec2.fromValues(
                path.begin[0] +
                    (i + 1) * (path.end[0] - path.begin[0])/(nbPoints + 1),
                path.begin[1] + (path.end[1] - path.begin[1])/2 * Math.random())
        );
    }

    let nbMovers = 30;
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
            mover.subjectTo(
                noc.forces.separate(sim.movers, mover.mass * 2.5,20)
            );
        }
    };
}
