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

    let grav = noc.forces.gravity(0.1);
    let fric = noc.forces.friction(0.1);
    let drag = noc.forces.drag(0.5);

    res.step = function(mover){
        mover.subjectTo(grav)
            .subjectTo(fric);

        // add drag when mover is in the lower half
        // of canvas
        if(mover.loc[1] > canvas.height/2) {
            mover.subjectTo(drag);
        }
    };

    return res;
}
