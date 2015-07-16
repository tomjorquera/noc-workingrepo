function mousetrack(canvasId) {

    let canvas = document.getElementById(canvasId);

    // monitor mouse position
    let mousePosition = [0, 0];
    canvas.onmousemove = (evt) => {
        let rect = canvas.getBoundingClientRect();

        // note: we invert the y-axis to translate between coordinates systems
        mousePosition = [
            (evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
            (rect.top-evt.clientY)/(rect.bottom-rect.top)*canvas.height];
    };

    return {
        pos: () => mousePosition
    };
}
