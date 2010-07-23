function Graph(_nodeId, _width, _height, _f) {

    var pxWidth = _width;
    var pxHeight = _height;
    var tileSize = 10;
    var tileFillSize = 4;

    var f = _f;

    var rangeX = [-Math.PI*2, Math.PI*2];
    var rangeY = [-2, 2];

//    var rangeX = [-5000, 10000];
//    var rangeY = [-5090, 10000];

    var parentNodeId = _nodeId;

    var unitsX = Math.abs(rangeX[0]) + Math.abs(rangeX[1]);
    var unitsY = Math.abs(rangeY[0]) + Math.abs(rangeY[1]);

    var ppuX = pxWidth / unitsX; // pixels per unit
    var ppuY = pxHeight / unitsY; // pixels per unit

    var pxOriginX = Math.abs(rangeX[0]) * ppuX;
    var pxOriginY = Math.abs(rangeY[1]) * ppuY;

    var markSpacingX = 1; // draw a mark every 10 units
    var markSpacingY = 1; // draw a mark every 10 units

    var styles = {
        "axis_x_line_color" : "#f00",
        "axis_x_mark_color" : "#f00",
        "axis_x_grid_color" : "#dbb",

        "axis_y_line_color" : "#00f",
        "axis_y_mark_color" : "#00f",
        "axis_y_grid_color" : "#bbd",

        "background_color" : "#fff",
        "curve_color" : "#000"
    };

    var mainNode = document.getElementById(parentNodeId);
    var c = document.createElement("canvas");
    c.setAttribute("width", pxWidth);
    c.setAttribute("height", pxHeight);
    mainNode.appendChild(c);

    var context = c.getContext("2d");

    _fillBackground();
    _drawAxis();
    _drawFunc();


    function _unitsToPxX(units) {
        return units * ppuX;
    }

    function _unitsToPxY(units) {
        return units * ppuY;
    }

    function _pxToUnitsX(px) {
        return px / ppuX;
    }

    function _pxToUnitsY(px) {
        return px / ppuY;
    }

    function _fillBackground() {
        context.fillStyle = styles["background_color"];
        context.fillRect(0, 0, pxWidth, pxHeight);
    }

    function _drawAxis() {
        _drawAxisX();
        _drawAxisY();
    }

    function _drawAxisX() {

        // draw marks and grid
        var psmx = _unitsToPxX(markSpacingX)
        var pxStart = _unitsToPxX( Math.abs(rangeX[0]) % markSpacingX );
        var pxEnd = pxWidth;

        for(var x = pxStart; x <= pxEnd; x+=psmx) {

            context.strokeStyle = styles["axis_x_grid_color"];
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, pxHeight);
            context.stroke();

            context.strokeStyle = styles["axis_x_mark_color"];
            context.beginPath();
            context.moveTo(x, pxOriginY - 3);
            context.lineTo(x, pxOriginY + 3);
            context.stroke();
        }

        // draw x axis
        context.beginPath();
        context.strokeStyle = styles["axis_x_line_color"];
        context.moveTo(0, pxOriginY);
        context.lineTo(pxWidth, pxOriginY);
        context.stroke();

        // draw x axis arrow
        context.beginPath();
        context.fillStyle = styles["axis_x_line_color"];
        context.moveTo(pxWidth, pxOriginY);
        context.lineTo(pxWidth - 10, pxOriginY - 5);
        context.lineTo(pxWidth - 5, pxOriginY);
        context.lineTo(pxWidth - 10, pxOriginY + 5);
        context.fill();
    }

    function _drawAxisY() {

        // draw marks and grid
        var psmy = _unitsToPxY(markSpacingY)
        var pxStart = _unitsToPxY( Math.abs(rangeY[1]) % markSpacingY );
        var pxEnd = pxHeight;

        for(var y = pxStart; y <= pxEnd; y+=psmy) {

            context.strokeStyle = styles["axis_y_grid_color"];
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(pxWidth, y);
            context.stroke();

            context.strokeStyle = styles["axis_y_mark_color"];
            context.beginPath();
            context.moveTo(pxOriginX-3, y);
            context.lineTo(pxOriginX+3, y);
            context.stroke();
        }

        // draw y axis
        context.beginPath();
        context.strokeStyle = styles["axis_y_line_color"];
        context.moveTo(pxOriginX, 0);
        context.lineTo(pxOriginX, pxHeight);
        context.stroke();

        // draw y axis arrow
        context.beginPath();
        context.fillStyle = styles["axis_y_line_color"];
        context.moveTo(pxOriginX, 0);
        context.lineTo(pxOriginX - 5, 10);
        context.lineTo(pxOriginX, 5);
        context.lineTo(pxOriginX + 5, 10);
        context.fill();
    }

    function _drawFunc() {

        context.strokeStyle = styles["curve_color"];
        context.beginPath();
        context.moveTo(0, 0);
        context.lineWidth = 2;

        for(var x = 0; x <= pxWidth; x+=5) {

            var ux = rangeX[0] + _pxToUnitsX(x);
            var uy = f(ux);
            var y = pxOriginY - _unitsToPxY(uy);

            console.debug(ux + " => " + uy);
            console.debug(x + "px => " + y + "px");

            context.lineTo(x, y);
        }
        context.stroke();
    }
}