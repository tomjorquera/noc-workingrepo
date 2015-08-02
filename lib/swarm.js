'use strict';

function swarm(
    params,
    particlesParam,
    initialForces = [],
    forces = [],
    nbParticles = 0
) {

    let res;

    // redefine default drawing function to draw particles
    if(params.render === undefined) {
        params.render = function(renderer) {
            for(let i = 0; i < res.particles.length; i++) {
                res.particles[i].render(renderer);
            }
        };

        res = noc.mover(params);

        // restore default params (in case of reuse)
        params.render = undefined;
    } else {
        res = noc.mover(params);
    }

    res.type = 'swarm';
    res.particles = [];

    res.addParticle = function() {

        // translate particles loc param relatively
        // to the swarm current position
        let originalLocParam = particlesParam.loc;
        if(originalLocParam === undefined) {
            particlesParam.loc = res.loc;
        } else {
            let relativeLoc = vec2.clone(originalLocParam);
            vec2.add(relativeLoc, relativeLoc, res.loc);
            particlesParam.loc = relativeLoc;
        }

        // create particle with modified params
        let p = noc.mover(particlesParam);

        // restore original param for future particles
        particlesParam.loc = originalLocParam;

        if(particlesParam.lifespan === undefined) particlesParam.lifespan = 255;

        p.lifespan = particlesParam.lifespan;

        p.parentUpdate = p.update;
        p.update = function(width, height, margin = 0) {
            // propagate to parent
            p.parentUpdate(width, height, margin);

            p.lifespan -= 1;
        };

        p.isDead = function() {
            return p.lifespan < 0;
        };

        // apply initial forces
        for(let i = 0; i < initialForces.length; i++) {
            p.subjectTo(initialForces[i]);
        }

        res.particles.push(p);

        return p;
    };

    for(let i = 0; i < nbParticles; i++) {
        res.addParticle(particlesParam);
    }

    res.parentUpdate = res.update;
    res.update = function(width, height, margin){
        // propagate to parent
        res.parentUpdate(width, height, margin);

        for (let i = 0; i < res.particles.length; i++) {
            let p = res.particles[i];
            for(let j = 0; j < forces.length; j++) {
                p.subjectTo(forces[j]);
            }
            p.update(width, height, margin);
        }

        // remove dead particles
        res.particles = res.particles.filter(
            (p) => (p.isDead == undefined )|| !p.isDead()
        );
    };

    return res;

}
