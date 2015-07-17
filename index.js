'use strict';

let app = new p2.WebGLRenderer(function() {
    let world = new p2.World();
    this.setWorld(world);

    let nbBalls = 50;

    let balls = [];

    for(let i = 0; i < nbBalls; i++){

        let mass = i == 0 || i == nbBalls-1 ? 0 : 1;
        let ball = new p2.Body({
            position: [i - nbBalls/2, 0],
            mass
        });

        ball.addShape(new p2.Circle({
            radius: 0.5
        }));

        world.addBody(ball);
        balls.push(ball);

        if(i > 0) {
            let distConstraint = new p2.DistanceConstraint(
                balls[i],
                balls[i-1]
            );
            distConstraint.setStiffness(500000);
            world.addConstraint(distConstraint);
        }
    }

    let step = 1;
    world.on("postStep", function(){
        if(step % 50 == 0) {
            let mPos = app.stage.stage.interactionManager.
                    mouse.getLocalPosition(app.stage);
            if(typeof mPos == 'undefined') {
                mPos = {x:0, y:0};
            }

            let b = new p2.Body({
                mass: Math.random()*5 + 10,
                position: [mPos.x, mPos.y]
            });
            b.damping = 0;
            b.addShape(new p2.Box({
                width: 1,
                height: 1
            }));
            world.addBody(b);

        }
        step++;

    });
});
