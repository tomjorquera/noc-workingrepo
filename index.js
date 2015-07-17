'use strict';

let app = new p2.WebGLRenderer(function() {
    let world = new p2.World();
    this.setWorld(world);
});
