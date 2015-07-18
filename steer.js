'use strict';

function steer(sim, mouse, renderer){

    sim.addMover({
        mass:5,
        loc: vec2.fromValues(50,50)
    });

    sim.addMover({
        mass:5,
        loc: vec2.fromValues(50,50),
        render: function(renderer) {
            renderer.drawCircle(
                this.loc[0],
                this.loc[1],
                this.mass,
                'green',
                'black'
            );
        }
    });

    let avoidWall = 10;
    let avoidSpeed = 20;

    let wanderlust = 5;
    let switchBehav = false;
    return {
        step:(mover) => {
            mover.subjectTo(noc.forces.steer(mouse.pos(), 0.5, 50));
            mover.subjectTo(noc.forces.drag(0.2));

            if(switchBehav) {
                // wander
                mover.subjectTo(noc.forces.custom(
                    "WANDER",
                    (mover) => {
                        let predictedLoc = vec2.create();
                        vec2.add(predictedLoc, mover.loc, mover.vel);
                        let angle = Math.random() * 2 * Math.PI;
                        let w = vec2.fromValues(
                            predictedLoc[0] + wanderlust * Math.cos(angle),
                            predictedLoc[1] + wanderlust * Math.sin(angle)
                        );
                        return noc.forces.steer(w, 0.45).f(mover);
                    }
                ));
            }

            switchBehav = !switchBehav;

            if(mover.loc[0] < avoidWall) {

                mover.subjectTo(noc.forces.custom(
                    "AVOID_WALL",
                    (mover) => {
                        let moveAway = vec2.fromValues(
                            avoidSpeed,
                            mover.loc[1]
                        );
                        let steer = vec2.create();
                        vec2.subtract(steer, moveAway, mover.vel);
                        return noc.forces.steer(steer, 2, avoidWall/3).f(mover);
                    }
                ));
            }
        }
    };
}
