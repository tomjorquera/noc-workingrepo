let app = new p2.WebGLRenderer(function() {

    let world = new p2.World({gravity: [0, -9.82]});
    this.setWorld(world);

    let ground = new p2.Body({
        position: [-100,0]
    });
    ground.addShape(new p2.Plane());
    world.addBody(ground);

    let bodyParts = [
        new p2.Circle({radius: 7}),
        new p2.Box({width:10, height:15})
    ];

    let body = new p2.Body({
        position: [30, 30],
        mass:1
    });
    body.addShape(bodyParts[0], [0, 5]);
    body.addShape(bodyParts[1], [0,-5]);

    world.addBody(body);
});
app.frame(0,0,640,320);
