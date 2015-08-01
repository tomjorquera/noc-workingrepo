'use strict';

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
