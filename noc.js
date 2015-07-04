
var noc = {};

noc.forces = {
    // gravity is a directed force depending on a mass and a gravitational constant (default 1)
    gravity: function(m, g = 1) {
        return vec2.fromValues(0, g * m);
    }
};

noc.mover = function(options = {}) {

    // some default values for undefined options
    if(options.loc === undefined) options.loc = vec2.fromValues(0,0);
    if(options.vel === undefined) options.vel = vec2.fromValues(0,0);
    if(options.acc === undefined) options.acc = vec2.fromValues(0,0);
    if(options.mass === undefined) options.mass = 1;
    if(options.wrapping === undefined) options.wrapping = true;

    var res = {};

    res.loc = options.loc;
    res.vel = options.vel;
    res.acc = options.acc;
    res.mass = options.mass;
    res.wrapping = options.wrapping;

    res.applyForce = function(force) {
        vec2.scaleAndAdd(this.acc, this.acc, force, 1/this.mass);
    };

    res.wrapBounds = function(width, height, margin) {
        if(this.loc[0] > width - margin) {
            this.loc[0] = this.loc[0] - width + margin;
        }
        if(this.loc[0] < 0) {
            this.loc[0] = width + this.loc[0] - margin;
        }
        if(this.loc[1] > height) {
            this.loc[1] = this.loc[1] - height + margin;
        }
        if(this.loc[1] < 0) {
            this.loc[1] = height + this.loc[1] - margin;
        }
    };

    res.stayInBounds = function(width, height, margin) {
        if ((this.loc[0] > width - margin) || (this.loc[0] < margin)) {
            this.vel = vec2.fromValues(this.vel[0] * -1, this.vel[1]);
        }
        if ((this.loc[1] > height - margin || (this.loc[1] < margin))) {
            this.vel = vec2.fromValues(this.vel[0], this.vel[1] * -1);
        }
    };

    res.update = function(width, height, margin = 0) {
        vec2.add(this.vel, this.vel, this.acc);
        vec2.add(this.loc, this.loc, this.vel);
        vec2.set(this.acc, 0, 0);

        if(this.wrapping) {
            this.wrapBounds(width, height, margin);
        } else {
            this.stayInBounds(width, height, margin);
        }
    };

    return res;
};
