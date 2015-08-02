function bounce(simulator, mouse) {

    let accFactor = 0.5;

    let mover = noc.mover(
        {
            mass: 5,
            loc: vec2.fromValues(100, 100),
            vel: vec2.fromValues(1, 3.3),
            render: function(renderer) {
                renderer.drawCircle(
                    this.loc[0],
                    this.loc[1],
                    15,
                    'blue',
                    'black'
                );
            },
            wrapping: false
        }
    );

    simulator.movers.push(mover);

    let force = noc.forces.custom(
        "VECTOR_DEMO",
        (mover) => {
            var direction = vec2.create();
            vec2.sub(direction, mouse.pos(), mover.loc);
            vec2.normalize(direction, direction);
            vec2.scale(direction, direction, accFactor);
            return direction;
        }
    );

    return {
        step: (mover) => {
            mover.subjectTo(force);
        }
    };
}
