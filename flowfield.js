function flowfield(sim, renderer, perlin) {

    noise.seed(Math.random());

    sim.addMover({
        mass:5,
        loc:vec2.fromValues(30, 30)
    });

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
    let ctx = renderer.canvas.getContext('2d');
    ctx.strokeStyle = 'lightgrey';
    let baseSetup = renderer.setup;
    renderer.setup = function(width, height){
        baseSetup(width, height);
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                let vec = field[i][j];
                let angle = Math.atan2(vec[1], vec[0]);

                let x = i * fieldResolution + fieldResolution/2 ,
                    y = j * fieldResolution + fieldResolution/2;

                let xR = Math.cos(angle)*1/3*fieldResolution,
                    yR = Math.sin(angle)*1/3*fieldResolution;

                renderer.drawTriangle(
                    x + xR,
                    y + yR,
                    fieldResolution/4,
                    'lightgrey',
                    'lightgrey',
                    angle
                );

                ctx.beginPath();
                ctx.moveTo(x + xR, y + yR);
                ctx.lineTo(x - xR, y - yR);
                ctx.stroke();

            }

        }

    };

    return {
        step:(mover) => {
            mover.subjectTo(forceField);
            mover.subjectTo(noc.forces.drag(0.1));
        }};
}
