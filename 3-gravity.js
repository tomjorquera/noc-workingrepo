function gravity(sim, nbMovers) {

    for(var i = 0; i < nbMovers; i++) {
        sim.addMover({
            loc: vec2.fromValues(
                Math.random() * canvas.width,
                Math.random() * canvas.height),
            mass: Math.random() * 15,
            wrapping: false });
    }

    let res = {};

    res._grav = noc.forces.gravity(0.1);
    res._fric = noc.forces.friction(0.1);

    res.step = function(mover){
        mover.subjectTo(res._grav)
            .subjectTo(res._fric);
    };

    return res;
}
