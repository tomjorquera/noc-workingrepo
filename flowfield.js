function flowfield(sim, renderer, perlin) {

    let ctx = renderer.canvas.getContext('2d');
    ctx.strokeStyle = 'lightgrey';

    noise.seed(Math.random());

    let nbMovers = 400;
    for(let i = 0; i < nbMovers; i++) {
        sim.addMover({
            mass:5,
            loc:vec2.fromValues(
                Math.random() * sim.width,
                Math.random() * sim.height
            )
        });
    }

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
        }
    }

    // define field force
    let forceField = noc.forces.custom(
        "FIELD",
        (mover) => {
            let loc = mover.loc;
            let x = Math.floor(loc[0]/fieldResolution);
            let y = Math.floor(loc[1]/fieldResolution);
            return field[x][y];
        }
    );

    // configure renderer to draw field
    let baseSetup = renderer.setup;
    renderer.setup = function(width, height){
        baseSetup(width, height);
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                field[i][j].render(renderer);
            }
        }
    };

    return {
        step:(mover) => {
            mover.subjectTo(forceField);
            mover.subjectTo(noc.forces.drag(0.1));
        }};
}
