'use strict';

let app = new p2.WebGLRenderer(function() {
    let world = new p2.World();
    this.setWorld(world);

    let ground = new p2.Body({
        position: [0,-1]
    });
    ground.addShape(new p2.Plane());
    world.addBody(ground);

    let bodyDist1 = new p2.Body({
        position: [0, 5],
        mass: 1
    });
    bodyDist1.addShape(new p2.Box({ width: 0.5, height:0.5}));
    world.addBody(bodyDist1);

    let bodyDist2 = new p2.Body({
        position: [1, 5],
        mass: 1
    });
    bodyDist2.addShape(new p2.Box({ width: 0.5, height:0.5}));
    world.addBody(bodyDist2);

    let distConstraint = new p2.DistanceConstraint(bodyDist1, bodyDist2);
    distConstraint.setStiffness(60);
    world.addConstraint(distConstraint);

    ////

    let bodyRev1 = new p2.Body({
        position: [0, 15],
        mass: 1
    });
    bodyRev1.addShape(new p2.Box({ width: 0.5, height:0.5}));
    world.addBody(bodyRev1);

    let bodyRev2 = new p2.Body({
        position: [1, 15],
        mass: 1
    });
    bodyRev2.addShape(new p2.Box({ width: 0.5, height:0.5}));
    world.addBody(bodyRev2);

    let revConstraint = new p2.RevoluteConstraint(
        bodyRev1,
        bodyRev2,
        {
            localPivotA: [-0.3, 0],
            localPivotB: [ 0.3, 0]
        }
    );
    world.addConstraint(revConstraint);

});
