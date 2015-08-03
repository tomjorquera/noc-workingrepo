Nature of Code - Working Repository
===================================

This repository contains some of the examples and exercises from the [Nature of Code book](http://natureofcode.com/), translated to HTML5.

At some point, this repository started to contain stubs for a physics engine, a rendering engine, a particle engine etc.

Note that the code contained in this repository was developed as an exercise, and is not meant to be up to production standard (aka you would be crazy to use it).

The different experiments translated from Nature of Code can be found in [the demo folder](demo/). They mostly follow the book (with some adaptation here and there). I have skipped some sections due to my previous familiarity to their content (mainly flocking agents, genetic algorithms and neural networks).

Dependencies
------------

Since I was working with Web technologies, I had to make some adaptations regarding the libraries used. I used the following ones:
- [glMatrix](http://glmatrix.net/) (MIT) for vector math.
- [p2.js](http://schteppe.github.io/p2.js/) (MIT) as physics engine replacement for Box2D.
- [pixi.js](https://github.com/pixijs/pixi.js) (MIT) as rendering engine for p2.js.
- [noisejs](https://github.com/josephg/noisejs) (public domain) for Perlin noise generation.
- [FPSMeter](http://darsa.in/fpsmeter/) (MIT) to display FPS.

Project Organization
--------------------

- demo: Demo and exercices translated from Nature of Code. The numbering is arbitrary, and each folder is named from the corresponding developement branch.
- lib: The libraries I developed for the project
- lib-external: The external libraries I used (see [Dependencies](#dependencies)).
- template: Template files for creating a new demo (note that you may need to change the path of the libs in the `index.html` file).

License
-------

All the files produced in the project (excluding the ones contained in lib-external) are licensed under GPLv3.
