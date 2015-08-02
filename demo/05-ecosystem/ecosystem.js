'use strict';

function ecosystem(sim, renderer, nbRunners, nbPredators) {

    let runners = [];
    let runnersRepulsion = [];
    let runnersYummyness = [];
    for(let i = 0; i < nbRunners; i++) {
        runners[i] = noc.mover({
            loc: vec2.fromValues(
                Math.random() * sim.width,
                Math.random() * sim.height),
            mass: 5,
            wrapping: false
        });
        runners[i].role = 'runner';
        sim.movers.push(runners[i]);

        let runnerAttraction = noc.forces.gravitational(runners[i], 5);
        runnersRepulsion[i] = noc.forces.custom(
            'REPULSION',
            (m) => vec2.scale(vec2.create(),
                              runnerAttraction.f(m), -1));
        runnersYummyness[i] = noc.forces.gravitational(runners[i], 1, 50, 50);
    }

    runners[1].debug = true;

    let predators = [];
    let predatorsRepulsion = [];
    for(let i = 0; i < nbPredators; i++) {
        predators[i] = noc.mover({
            loc: vec2.fromValues(
                Math.random() * sim.width,
                Math.random() * sim.height),
            mass: 20,
            wrapping: false
        });
        predators[i].role = 'predator';
        sim.movers.push(predators[i]);

        let predatorAttraction = noc.forces.gravitational(predators[i], 150);
        predatorsRepulsion[i] = noc.forces.custom(
            'REPULSION',
            (m) => vec2.scale(vec2.create(),
                              predatorAttraction.f(m), -1));
    }

    let attractor = {
        mass: 30,
        loc: vec2.fromValues(sim.height/2, sim.width/2)
    };

    function getMousePos(evt) {
        let rect = renderer.canvas.getBoundingClientRect();
        return vec2.fromValues(
            (evt.clientX-rect.left)/(rect.right-rect.left)*renderer.canvas.width,
            (evt.clientY-rect.top)/(rect.bottom-rect.top)*renderer.canvas.height);
    }

    renderer.canvas.onmousemove = (evt) => attractor.loc = getMousePos(evt);

    let attractorForce = noc.forces.gravitational(attractor, 1, 5, 5);
    let dragForce = noc.forces.drag(5);

    return {
        step: (mover) => {
            switch(mover.role) {

            case 'runner':
                mover.subjectTo(attractorForce).subjectTo(dragForce);
                for(let i = 0; i < nbRunners; i++) {
                    if(mover != runners[i]) {
                        mover.subjectTo(runnersRepulsion[i]);
                    }
                }
                for(let i = 0; i < nbPredators; i++) {
                    mover.subjectTo(predatorsRepulsion[i]);
                }
                break;

            case 'predator':
                mover.subjectTo(dragForce);
                for(let i = 0; i < nbRunners; i++) {
                    mover.subjectTo(runnersYummyness[i]);
                }
                break;
            }

        }
    };
}
