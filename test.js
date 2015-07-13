function test(sim) {

    let randomThrow = (random) => noc.forces.custom(
        "THROW",
        (mover) => {
            let angle = Math.PI * 5/4 + random * Math.PI/2;
            let force = vec2.fromValues(Math.cos(angle), Math.sin(angle));
            vec2.scale(force, force, 3);
            return force;
        }
    );

    let swm = swarm(
        {
            mass: 0.01,
            loc: vec2.fromValues(sim.width/2, sim.height/2)
        },
        {
            mass: 5,
            wrapping:false,
            lifespan: 200,
            render: function(renderer) {
                renderer.drawCircle(
                    this.loc[0],
                    this.loc[1],
                    this.mass,
                    'rgba(0,0,255,' + this.lifespan/200 + ')',
                    'rgba(0,0,0,' + this.lifespan/200 + ')'
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
                    if(mover.lifespan && mover.lifespan > 190) {
                        return mover.initalForce.f(mover);
                    } else {
                        return vec2.fromValues(0,0);
                    }
                }
            )
        ]
    );

    sim.movers.push(swm);

    return {
        swm,
        step: (mover) => {
            if(mover.type == 'swarm') {
                let p = mover.addParticle();
                p.initalForce = randomThrow(Math.random());
            }
        }
    };
}
