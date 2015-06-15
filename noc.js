var noc = {};

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

    res.wrapBounds = function(width, height) {
        if(this.loc[0] > width) {
            this.loc[0] = this.loc[0] - width;
        }
        if(this.loc[0] < 0) {
            this.loc[0] = width + this.loc[0];
        }
        if(this.loc[1] > height) {
            this.loc[1] = this.loc[1] - height;
        }
        if(this.loc[1] < 0) {
            this.loc[1] = height + this.loc[1];
        }
    };

    res.stayInBounds = function(width, height) {
        if ((this.loc[0] > width) || (this.loc[0] < 0)) {
            this.vel = vec2.fromValues(this.vel[0] * -1, this.vel[1]);
        }
        if ((this.loc[1] > height) || (this.loc[1] < 0)) {
            this.vel = vec2.fromValues(this.vel[0], this.vel[1] * -1);
        }
    };

    res.update = function(width, height) {
        vec2.add(this.vel, this.vel, this.acc);
        vec2.add(this.loc, this.loc, this.vel);
        vec2.set(this.acc, 0, 0);

        if(this.wrapping) {
            this.wrapBounds(width, height);
        } else {
            this.stayInBounds(width, height);
        }
    };

    return res;
};
