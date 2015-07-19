function flowfield(sim, renderer, perlin) {

    let ctx = renderer.canvas.getContext('2d');
    ctx.strokeStyle = 'lightgrey';

    noise.seed(Math.random());

    let fieldResolution = 20,
        cols = sim.width/fieldResolution,
        rows = sim.height/fieldResolution,
        field = [];

    // populate field with force vectors
    for(let i = 0; i < cols; i++) {
        field[i] = [];
        for(let j = 0; j < rows; j++) {
            let angle = noise.perlin2(i/cols,j/rows)*2*Math.PI;
            field[i][j] = vec2.fromValues(Math.cos(angle), Math.sin(angle));

            // precalculate some values to speed up rendering
            let x = i * fieldResolution + fieldResolution/2;
            let y = j * fieldResolution + fieldResolution/2;
            let xR = Math.cos(angle)*1/3*fieldResolution;
            let yR = Math.sin(angle)*1/3*fieldResolution;
            let xPR = x + xR;
            let yPR = y + yR;
            let xNR = x - xR;
            let yNR = y - yR;

            field[i][j].render = function(renderer) {
                renderer.drawTriangle(
                    xPR,
                    yPR,
                    fieldResolution/4,
                    'lightgrey',
                    'lightgrey',
                    angle
                );

                ctx.beginPath();
                ctx.moveTo(xPR, yPR);
                ctx.lineTo(xNR, yNR);
                ctx.stroke();
            };

            field[i][j].movers = [];
        }
    }

    // define field force
    let forceField = noc.forces.custom(
        "FIELD",
        (mover) => {
            let loc = mover.loc;
            let x = Math.floor(loc[0]/fieldResolution);
            let y = Math.floor(loc[1]/fieldResolution);
            let steer = vec2.create();
            vec2.scale(steer, field[x][y], 5);
            vec2.subtract(steer, steer, mover.vel);
            if(vec2.length(steer) > 0.5){
                vec2.normalize(steer, steer);
                vec2.scale(steer, steer, 0.5);
            }
            return steer;
        }
    );

    // configure renderer to draw field
    let baseSetup = renderer.setup;
    renderer.setup = function(width, height){
        baseSetup(width, height);
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                field[i][j].render(renderer);

                // reset movers positions in the field
                field[i][j].movers.length = 0;
            }
        }
    };

    let nbMovers = 400;
    let moverViz = 1;
    let moverRepulsion = 0.1;

    for(let i = 0; i < nbMovers; i++) {
        let runner = noc.mover({
            mass:5,
            loc:vec2.fromValues(
                Math.random() * sim.width,
                Math.random() * sim.height
            )
        });

        runner.oldRender = runner.render;
        runner.render = function(renderer) {
            this.oldRender(renderer);

            // add itself to the list of runners in this field position
            let x = Math.floor(runner.loc[0]/fieldResolution);
            let y = Math.floor(runner.loc[1]/fieldResolution);
            field[x][y].movers.push(runner);
        };

        runner.repulsion = noc.forces.custom(
            'REPULSION',
            (m) => vec2.scale(vec2.create(),
                              noc.forces.gravitational(
                                  runner,
                                  moverRepulsion
                              ).f(m), -1)
        );
        sim.movers.push(runner);
    }

    return {
        step:(mover) => {
            mover.subjectTo(forceField);
            mover.subjectTo(noc.forces.drag(0.1));

            // repulsion from mover too near of its position
            let locX = Math.floor(mover.loc[0]/fieldResolution);
            let locY = Math.floor(mover.loc[1]/fieldResolution);
            for(let i = locY - moverViz; i <= locY + moverViz; i++) {
                for(let j = locX - moverViz; j <= locX + moverViz; j++) {
                    if(i > 0 && i < cols && j > 0 && j < rows) {
                        let f = field[i][j].movers;
                        for(var k = 0; k < f.length; k++) {
                            if(mover != f[k]) {
                                mover.subjectTo(f[k].repulsion);
                            }
                        }
                    }
                }
            }
        }
    };
}
