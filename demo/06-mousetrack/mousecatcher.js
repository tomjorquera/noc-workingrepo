function mousecatcher(sim, mouse) {

    sim.addMover({
        loc: vec2.fromValues(sim.width/2, sim.height/2),
        mass: 15,
        angle: 0,
        aLimit:0.05,
        render: function(renderer) {
            renderer.drawTriangle(
                this.loc[0],
                this.loc[1],
                this.mass,
                'blue',
                'black',
                this.angle
            );
        }
    });
    return {
        step: (mover) => {
            mover
                .subjectTo(noc.forces.forward(8))
                .subjectTo(noc.forces.drag(5))
                .subjectTo(noc.forces.track(mouse.pos()));
        }
    };
}
