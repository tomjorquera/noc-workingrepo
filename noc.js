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
//
// A force can optionally be angular or relative.
// A relative force depends on the mover angle.
// E.g. the relative force [1,0] corresponds to "move forward"
// For angular forces, the relative option has no effect.
noc.forces = {

    // a general constructor to build your own forces
    custom: function(type, f, angular = false, relative = false) {
        return { type, f, angular, relative };
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

    // gravitational force is the attraction to another object
    // with a position and a mass
    gravitational: function(
        otherObject,
        gravityConst = 1,
        minDist = 1,
        maxDist = null
    ) {
        return noc.forces.custom(
            "GRAVITATIONAL",
            (mover => {
                let dist = vec2.distance(mover.loc, otherObject.loc);
                if(dist < minDist) {
                    dist = minDist;
                }
                if(maxDist != null && dist > maxDist) {
                    dist = maxDist;
                }

                let force = vec2.create();
                vec2.subtract(force, otherObject.loc, mover.loc);
                vec2.normalize(force, force);

                let strength = (gravityConst * mover.mass * otherObject.mass)
                        / (dist * dist);
                vec2.scale(force, force, strength);

                return force;
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
    },

    // a simple constant angular force
    rotate: function(angle) {
        return noc.forces.custom(
            "ROTATE",
            (mover => {
                return angle;
            }),
            true
        );
    },

    // track a given position
    track: function(pos) {
        return noc.forces.custom(
            "TRACK",
            (mover => {
                let diff = vec2.create();
                vec2.subtract(diff, pos, mover.loc);
                let angle = Math.atan2(diff[1], diff[0]) -  mover.angle;
                if(angle > Math.PI) {
                    angle -= 2*Math.PI;
                }
                if(angle < -1 * Math.PI) {
                    angle += 2*Math.PI;
                }
                return angle;
            }),
            true
        );
    },

    // some relative forces
    forward: function(coeff) {
        return noc.forces.custom(
            "FORWARD",
            (mover => {
                return vec2.fromValues(coeff, 0);
            }),
            false,
            true
        );
    },

    backward: function(coeff) {
        return noc.forces.custom(
            "BACKWARD",
            (mover => {
                return vec2.fromValues(-1 * coeff, 0);
            }),
            false,
            true
        );
    },

    left: function(coeff) {
        return noc.forces.custom(
            "LEFT",
            (mover => {
                return vec2.fromValues(0, -1 * coeff);
            }),
            false,
            true
        );
    },

    right: function(coeff) {
        return noc.forces.custom(
            "RIGHT",
            (mover => {
                return vec2.fromValues(0, coeff);
            }),
            false,
            true
        );
    }
};

noc.trigo = {
    // helper functions to convert from degrees to radians
    // ex: degrees(180) === Math.PI radians
    degrees : (d) => d * Math.PI  / 180
};

noc.mover = function(options = {}) {

    // some default values for undefined options
    if(options.loc === undefined) options.loc = vec2.fromValues(0,0);
    if(options.vel === undefined) options.vel = vec2.fromValues(0,0);
    if(options.acc === undefined) options.acc = vec2.fromValues(0,0);
    if(options.angle === undefined) options.angle = 0;
    if(options.aVel === undefined) options.aVel = 0;
    if(options.aAcc === undefined) options.aAcc = 0;
    if(options.mass === undefined) options.mass = 1;
    if(options.wrapping === undefined) options.wrapping = true;
    if(options.limit === undefined) options.limit = [3,3];
    if(options.aLimit === undefined) options.aLimit = 5;
    if(options.render === undefined) options.render = function(renderer) {
        renderer.drawCircle(
            this.loc[0],
            this.loc[1],
            this.mass,
            'blue',
            'black'
        );
    };

    var res = {};

    res.loc = vec2.clone(options.loc);
    res.vel = vec2.clone(options.vel);
    res.acc = vec2.clone(options.acc);
    res.angle = options.angle;
    res.aVel = options.aVel;
    res.aAcc = options.aAcc;
    res.mass = options.mass;
    res.wrapping = options.wrapping;
    res.limit = vec2.clone(options.limit);
    res.aLimit = options.aLimit;
    res.render = options.render;

    // directly apply a force vector to a mover
    // note: in the general case, this function should not be used
    // directly. The `subjectTo` function should be used instead.
    res.applyForceVec = function(forceVector, relative) {
        if(relative) {
            let vectorAngle = Math.atan2(forceVector[1], forceVector[0]);

            let finalAngle = this.angle + vectorAngle;
            let length = vec2.length(forceVector);

            let rotatedVector = vec2.fromValues(
                Math.cos(finalAngle),
                Math.sin(finalAngle)
            );
            vec2.scale(rotatedVector, rotatedVector, length);
            vec2.scaleAndAdd(this.acc, this.acc, rotatedVector, 1/this.mass);
        } else {
            vec2.scaleAndAdd(this.acc, this.acc, forceVector, 1/this.mass);
        }
        // allow chaining
        return this;
    };


    // directly apply an angular force to a mover
    // note: in the general case, this function should not be used
    // directly. The `subjectTo` function should be used instead.
    res.applyAngularForce = function(angularForce) {
        this.aAcc += angularForce;
        // allow chaining
        return this;
    };

    // Take a force and apply it to the mover.
    // note: this function can be overrided to enable special
    // behaviors when applying forces.
    res.subjectTo = function(force) {
        if(force.angular) {
            return this.applyAngularForce(force.f(this));
        } else {
            return this.applyForceVec(force.f(this), force.relative);
        }
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
        if(this.vel[0] > this.limit[0]) {
            this.vel[0] = this.limit[0];
        }
        if(this.vel[0] < -1 * this.limit[0]) {
            this.vel[0] = -1 * this.limit[0];
        }
        if(this.vel[1] > this.limit[1]) {
            this.vel[1] = this.limit[1];
        }
        if(this.vel[1] < -1 * this.limit[1]) {
            this.vel[1] = -1 * this.limit[1];
        }

        vec2.add(this.loc, this.loc, this.vel);
        vec2.set(this.acc, 0, 0);

        // angular acceleration handling
        this.aVel += this.aAcc;

        if (this.aVel > this.aLimit) {
            this.aVel = this.aLimit;
        }
        if (this.aVel < -1 * this.aLimit) {
            this.aVel = -1 * this.aLimit;
        }

        this.angle += this.aVel;
        this.aAcc = 0;

        if(this.angle >= 2*Math.PI || this.angle <= -2*Math.PI) {
            this.angle = this.angle % (2*Math.PI);
        }

        if(this.wrapping) {
            this.wrapBounds(width, height, margin);
        } else {
            this.stayInBounds(width, height, margin);
        }
    };

    return res;
};
