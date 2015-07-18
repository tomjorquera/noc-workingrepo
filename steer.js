'use strict';

function steer(sim, mouse){

    sim.addMover({
        mass:5
    });

    return {
        step:(mover) => {
            mover.subjectTo(noc.forces.steer(mouse.pos(), 0.5, 50));
            mover.subjectTo(noc.forces.drag(0.2));
        }
    };
}
