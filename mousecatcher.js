function mousecatcher(sim, render) {

    sim.addMover({
        loc: vec2.fromValues(sim.width/2, sim.height/2),
        mass: 15,
        angle: 0,
        aLimit:0.05
    });

    function getMousePos(evt) {
        let rect = render.canvas.getBoundingClientRect();
        return vec2.fromValues(
            (evt.clientX-rect.left)/(rect.right-rect.left)*render.canvas.width,
            (evt.clientY-rect.top)/(rect.bottom-rect.top)*render.canvas.height);
    }

    let mousePos = vec2.fromValues(sim.width/2, sim.height/2);
    render.canvas.onmousemove = (evt) => mousePos = getMousePos(evt);

    return {
        step: (mover) => {

            mover
                .subjectTo(noc.forces.forward(8))
                .subjectTo(noc.forces.drag(5))
                .subjectTo(noc.forces.track(mousePos));

        }
    };
}
