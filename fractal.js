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
