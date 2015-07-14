function test(sim) {

    let repeller = noc.mover({
        mass: 30,
        loc: vec2.fromValues(170, 170)
    });
    sim.movers.push(repeller);

    let repulsion = noc.forces.custom(
        "REPULSION",
        (m) => vec2.scale(
            vec2.create(),
            noc.forces.gravitational(repeller, 4).f(m),
            -1
        )
    );

    let randomThrow = (random) => noc.forces.custom(
        "THROW",
        (mover) => {
            let angle = Math.PI * 11/8 + random * Math.PI/4;
            let force = vec2.fromValues(Math.cos(angle), Math.sin(angle));
            vec2.scale(force, force, 3);
            return force;
        }
    );

    let swm = swarm(
        {
            mass: 5,
            loc: vec2.fromValues(sim.width/2, sim.height/2)
        },
        {
            mass: 5,
            wrapping:false,
            lifespan: 180,
            render: function(renderer) {

                let ctx = renderer.canvas.getContext('2d');
                let gradient = ctx.createRadialGradient(
                    this.loc[0],
                    this.loc[1],
                    0,
                    this.loc[0],
                    this.loc[1],
                    this.mass
                );

                gradient.addColorStop(
                    0, 'rgba(0,0,255,' + this.lifespan/180 + ')'
                );
                gradient.addColorStop(
                    1, 'rgba(0,0,255,0)'
                );

                renderer.drawCircle(
                    this.loc[0],
                    this.loc[1],
                    this.mass,
                    gradient,
                    'rgba(0,0,255,0)'
                );
            }
        },
        [],
        [
            noc.forces.gravity(0.1),
            noc.forces.drag(0.1),
            noc.forces.custom(
                "CONTINUE_THROW",
                (mover) => {
                    if(mover.lifespan && mover.lifespan > 175) {
                        return mover.initalForce.f(mover);
                    } else {
                        return vec2.fromValues(0,0);
                    }
                }
            ),
            repulsion
        ]
    );

    sim.movers.push(swm);

    return {
        swm,
        step: (mover) => {
            if(mover.type == 'swarm') {

                mover.
                    subjectTo(noc.forces.drag(5)).
                    subjectTo(noc.forces.gravitational({
                        loc: mouse.pos(), mass:30
                    }, 1, 5, 5));

                for(var i = 0; i < 15; i++) {
                    let p = mover.addParticle();
                    p.initalForce = randomThrow(Math.random());
                }
            }
        }
    };
}
