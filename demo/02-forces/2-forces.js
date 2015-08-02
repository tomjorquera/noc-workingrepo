function forces(sim) {
    for(let i = 0; i < 100; i++) {
        sim.movers.push(
            noc.mover({
                loc: vec2.fromValues(
                    Math.random() * sim.width,
                    Math.random() * sim.height),
                mass: Math.random() * 15,
                wrapping: i < 50 })
        );
    }

    return {
        step: function(mover){
            mover.applyForceVec(vec2.fromValues(0.1, 0.1));
        }
    };
}
