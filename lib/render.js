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
function render(canvasId) {

    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    return {
        canvas,
        drawCircle: function(x, y, radius, fillColor, strokeColor) {
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;

            ctx.beginPath();
            ctx.arc(x,y, radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        },
        drawTriangle: function(
            x,
            y,
            radius,
            fillColor,
            strokeColor,
            rotation = 0
        ) {
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;

            // draw lines between vertices
            let path = new Path2D();

            let top = [x + radius * Math.cos(rotation),
                       y + radius * Math.sin(rotation)];
            path.moveTo(top[0], top[1]);

            path.lineTo(x + radius * Math.cos(Math.PI * 2/3 + rotation),
                        y + radius * Math.sin(Math.PI * 2/3 + rotation));

            path.lineTo(x + radius * Math.cos(Math.PI * 4/3 + rotation),
                        y + radius * Math.sin(Math.PI * 4/3 + rotation));

            path.lineTo(top[0], top[1]);

            ctx.fill(path);
        },
        setup: function(width, height) {
            // change canvas size according to new dimentions
            canvas.width = width;
            canvas.height = height;
            // clean canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };
}
