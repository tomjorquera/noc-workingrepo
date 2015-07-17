'use strict';

let app = new p2.WebGLRenderer(function() {
    let world = new p2.World();
    this.setWorld(world);

    let ground = new p2.Body({
        position: [0,-1]
    });
    ground.addShape(new p2.Plane());
    world.addBody(ground);

    let fixation = new p2.Body({
        mass: 0,
        position: [0,0]
    });
    fixation.addShape(new p2.Box({
        width: 0.1,
        height: 2
    }));
    world.addBody(fixation);

    let spinner = new p2.Body({
        mass: 1,
        position: [0,2]
    });
    spinner.addShape(new p2.Box({
        width: 3.9,
        height: 0.2
    }));
    world.addBody(spinner);

    let revConstraint = new p2.RevoluteConstraint(
        fixation,
        spinner,
        {
            localPivotA: [ 0, 1],
            localPivotB: [ 0, 0]
        }
    );
    world.addConstraint(revConstraint);
    revConstraint.enableMotor();
    revConstraint.setMotorSpeed(5);

    let step = 1;
    world.on("postStep", function(){
        if(step % 50 == 0) {
            let mPos = app.stage.stage.interactionManager.
                    mouse.getLocalPosition(app.stage);
            if(typeof mPos == 'undefined') {
                mPos = {x:0, y:0};
            }

            let b = new p2.Body({
                mass: 1,
                position: [mPos.x, mPos.y]
            });
            b.addShape(new p2.Circle({
                radius: 0.33
            }));
            world.addBody(b);

        }
        step++;
    });
});
