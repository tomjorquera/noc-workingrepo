'use strict';

var noc = {};

// A force is defined as an object with a type, indicating the
// kind of force, and a function which takes a mover in input and
// returns a force vector.
//
// The idea is to pass the force functions to the movers, which
// will control how the forces are applied depending on their
// type (inversion of control).
//
// Here we define some constructors for classical forces. A force
// constructor takes some global parameters (e.g. gravitational
// constant) and returns a force (a force being a function to be
// passed to the movers).
noc.forces = {

    // a general constructor to build your own forces
    custom: function(type, f) {
        return { type, f };
    },

    // gravity is a directed force depending on a mass and a
    // gravitational constant (default 1)
    gravity: function(gravityConst = 1) {
        return noc.forces.custom(
            "GRAVITY",
            (mover => {
                return vec2.fromValues(0, gravityConst * mover.mass);
            })
        );
    },

    // friction is a directed force opposite to the velocity,
    // depending on a normal vector (default (1,1)) and scaled
    // to a friction coeff (default 1)
    friction: function(frictionCoeff = 1, norm = vec2.fromValues(1,1)) {
        return noc.forces.custom(
            "FRICTION",
            (mover => {
                let frictionMag = vec2.create();
                vec2.scale(frictionMag, norm, frictionCoeff);

                let res = vec2.create();
                vec2.normalize(res, mover.vel);
                vec2.scale(res, res, -1);
                vec2.multiply(res, res, frictionMag);
                return res;
            })
        );
    },

    // drag is a force opposite to the velocity, depending
    // on on the env drag coeff, the mover frontal area and
    // the env density.
    drag: function(dragCoeff, frontalArea = 1, density = 1) {
        return noc.forces.custom(
            "DRAG",
            (mover => {
                let res = vec2.create();
                let scale_factor = -1/2 * dragCoeff * frontalArea * density;

                vec2.normalize(res, mover.vel);
                vec2.multiply(res, res, mover.vel);
                vec2.multiply(res, res, mover.vel);

                vec2.scale(res, res, scale_factor);

                return res;
            })
        );
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

    // directly apply a force vector to a mover
    // note: in the general case, this function should not be used
    // directly. The `subjectTo` function should be used instead.
    res.applyForceVec = function(forceVector) {
        vec2.scaleAndAdd(this.acc, this.acc, forceVector, 1/this.mass);
        // allow chaining
        return this;
    };

    // Take a force and apply it to the mover.
    // note: this function can be overrided to enable special
    // behaviors when applying forces.
    res.subjectTo = function(force) {
        this.applyForceVec(force.f(this));
        // allow chaining
        return this;
    };

    // the mover wrap around borders at less than `margin` distance
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

    // the mover bounce on borders at less than `margin` distance
    res.stayInBounds = function(width, height, margin) {
        if ((this.loc[0] > width - margin) || (this.loc[0] < margin)) {
            this.vel = vec2.fromValues(this.vel[0] * -1, this.vel[1]);
        }
        if ((this.loc[1] > height - margin || (this.loc[1] < margin))) {
            this.vel = vec2.fromValues(this.vel[0], this.vel[1] * -1);
        }
    };

    // update the mover position in the space according to its
    // current velocity
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
