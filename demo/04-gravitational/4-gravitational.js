function gravitational(sim, nbMovers) {

    for(let i = 0; i < nbMovers; i++) {
        sim.addMover({
            loc: vec2.fromValues(
                Math.random() * canvas.width,
                Math.random() * canvas.height),
            mass: Math.random() * 15,
            wrapping: false });
    }

    let grav = [];
    for(let i = 0; i < sim.movers.length; i++) {
        grav[i] = noc.forces.gravitational(sim.movers[i], 1, 10, 50);
    }
    return {
        step: (mover) => {
            for(let i = 0; i < sim.movers.length; i++) {
                if(mover != sim.movers[i]) {
                    mover.subjectTo(grav[i]);
                }
            }
        }
    };
}
