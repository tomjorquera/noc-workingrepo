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
});
