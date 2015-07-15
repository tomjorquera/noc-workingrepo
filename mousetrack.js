function mousetrack(canvasId) {

    let canvas = document.getElementById(canvasId);

    // monitor mouse position
    let mousePosition = [0, 0];
    canvas.onmousemove = (evt) => {
        let rect = canvas.getBoundingClientRect();

        mousePosition = [
            (evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
            (evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height];
    };

    return {
        pos: () => mousePosition
    };
}
