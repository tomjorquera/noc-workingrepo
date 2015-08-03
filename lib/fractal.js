'use strict';

/*
 @licstart  The following is the entire license notice for the
 JavaScript code in this page.

 Copyright (C) 2015 Tom Jorquera

 The JavaScript code in this page is free software: you can
 redistribute it and/or modify it under the terms of the GNU
 General Public License (GNU GPL) as published by the Free Software
 Foundation, either version 3 of the License, or (at your option)
 any later version.  The code is distributed WITHOUT ANY WARRANTY;
 without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

 As additional permission under GNU GPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.


 @licend  The above is the entire license notice
 for the JavaScript code in this page.
 */
function recurse(
    renderer,
    drawFunction,
    parametersFunction,
    nbIterations,
    nbByIter,
    initParams
) {

    function __rec(params, curr_iter) {
        drawFunction(renderer, params);
        if(curr_iter < nbIterations) {
            for(let inst = 0; inst < nbByIter; inst++) {
                __rec(parametersFunction(
                    params,
                    inst/(nbByIter - 1)),
                      curr_iter + 1)
                ;
            }
        }
    }

    __rec(initParams, 0);
}

function kochLine(start, end) {

    let kochB = vec2.create();
    vec2.sub(kochB, end, start);
    vec2.scale(kochB, kochB, 1/3);
    vec2.add(kochB, kochB, start);

    let kochC = vec2.create();
    vec2.sub(kochC, end, start);
    vec2.scale(kochC, kochC, 1/3);
    vec2.set(
        kochC,
        kochC[0] * Math.cos(Math.PI * -1/3)
            - kochC[1] * Math.sin(Math.PI * -1/3),
        kochC[0] * Math.sin(Math.PI * -1/3)
            + kochC[1] * Math.cos(Math.PI * -1/3)
    );
    vec2.add(kochC, kochC, kochB);

    let kochD = vec2.create();
    vec2.sub(kochD, end, start);
    vec2.scale(kochD, kochD, 2/3);
    vec2.add(kochD, kochD, start);

    return {
        gen: function() {
            return [
                kochLine(start, kochB),
                kochLine(kochB, kochC),
                kochLine(kochC, kochD),
                kochLine(kochD, end)
            ];
        },
        render: function(renderer) {
            let ctx = renderer.canvas.getContext('2d');
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();
        }
    } ;
}

function kochCurve(start, end) {

    return {
        lines: [kochLine(start,end)],
        gen: function(){
            let newLines = [];
            for(let line of this.lines) {
                newLines = newLines.concat(line.gen());
            }
            this.lines = newLines;
        },
        render: function(renderer) {
            for(let line of this.lines) {
                line.render(renderer);
            }
        }
    };
}

function lSystem(axiom, ruleFunction, renderFunction) {
    return {
        state: axiom,
        iterate: function() {
            this.state = this.state.map(ruleFunction).
                reduce((a,b) =>  a.concat(b));
        },
        render: function(renderer) {
            let ctx = renderer.canvas.getContext('2d');
            for(let token of this.state) {
                renderFunction(token, ctx);
            }
        }
    };
}

function turtle(startingPos, speed, startingAngle, rotation) {
    return {
        speed,
        rotation,
        currentPos: startingPos,
        currentAngle: startingAngle,
        savedPos: [],
        savedAngle: [],
        render: function(sentence, renderer) {
            let ctx = renderer.canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(this.currentPos[0], this.currentPos[1]);
            for(let token of sentence) {
                let newPos = [
                    this.currentPos[0] +
                        this.speed * Math.cos(this.currentAngle),
                    this.currentPos[1] +
                        this.speed * Math.sin(this.currentAngle)
                ];
                switch(token) {
                case 'F':
                    ctx.lineTo(newPos[0], newPos[1]);
                    this.currentPos = newPos;
                    break;
                case 'G':
                    ctx.moveTo(newPos[0], newPos[1]);
                    this.currentPos = newPos;
                    break;
                case '+':
                    this.currentAngle += this.rotation;
                    break;
                case '-':
                    this.currentAngle -= this.rotation;
                    break;
                case '[':
                    this.savedPos.push(this.currentPos);
                    this.savedAngle.push(this.currentAngle);
                    break;
                case ']':
                    this.currentPos = this.savedPos.pop();
                    this.currentAngle = this.savedAngle.pop();
                    ctx.moveTo(this.currentPos[0], this.currentPos[1]);
                    break;
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
    };
}
