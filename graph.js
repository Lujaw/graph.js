
function Graph(
    _parentNodeId,
    _width,
    _height,
    _rangeX,
    _rangeY,
    _config,
    _styles) {

    var parentNodeId = _parentNodeId;
    var pxWidth = _width;
    var pxHeight = _height;
    var rangeX = _rangeX;
    var rangeY = _rangeY;

    var config = {
        markSpacingX: 1,    // draw a mark every n units on the X axis
        markSpacingY: 1,     // draw a mark every n units on the Y axis
        detailLevel: 5
    };

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

    // merge user config and styles
    for(attr in _config) { config[attr] = _config[attr] };
    for(attr in _styles) { styles[attr] = _styles[attr] };

    // precalculate some values for convinience
    var unitsX = Math.abs(rangeX[0]) + Math.abs(rangeX[1]);
    var unitsY = Math.abs(rangeY[0]) + Math.abs(rangeY[1]);

    var ppuX = pxWidth / unitsX; // pixels per unit
    var ppuY = pxHeight / unitsY; // pixels per unit

    var pxOriginX = Math.abs(rangeX[0]) * ppuX;
    var pxOriginY = Math.abs(rangeY[1]) * ppuY;

    // create canvas node
    var mainNode = document.getElementById(parentNodeId);
    var c = document.createElement("canvas");
    c.setAttribute("width", pxWidth);
    c.setAttribute("height", pxHeight);
    mainNode.appendChild(c);

    var context = c.getContext("2d");

    // draw grid and axis
    _clear();

    function _moveTo(x, y) {
        context.moveTo(Math.round(x)+0.5, Math.round(y)+0.5);
    }

    function _lineTo(x, y) {
        context.lineTo(Math.round(x)+0.5, Math.round(y)+0.5);
    }

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

    function _drawGrid() {
        // draw marks and grid
        var psmx = _unitsToPxX(config.markSpacingX)
        var pxStart = _unitsToPxX( Math.abs(rangeX[0]) % config.markSpacingX );
        var pxEnd = pxWidth;

        for(var x = pxStart; x <= pxEnd; x+=psmx) {

            context.strokeStyle = styles["axis_x_grid_color"];
            context.beginPath();
            _moveTo(x, 0);
            _lineTo(x, pxHeight);
            context.stroke();

            context.strokeStyle = styles["axis_x_mark_color"];
            context.beginPath();
            _moveTo(x, pxOriginY - 3);
            _lineTo(x, pxOriginY + 3);
            context.stroke();
        }

        // draw marks and grid
        var psmy = _unitsToPxY(config.markSpacingY)
        var pxStart = _unitsToPxY( Math.abs(rangeY[1]) % config.markSpacingY );
        var pxEnd = pxHeight;

        for(var y = pxStart; y <= pxEnd; y+=psmy) {

            context.strokeStyle = styles["axis_y_grid_color"];
            context.beginPath();
            _moveTo(0, y);
            _lineTo(pxWidth, y);
            context.stroke();

            context.strokeStyle = styles["axis_y_mark_color"];
            context.beginPath();
            _moveTo(pxOriginX-3, y);
            _lineTo(pxOriginX+3, y);
            context.stroke();
        }
    }

    function _drawAxisX() {

        // draw x axis
        context.beginPath();
        context.strokeStyle = styles["axis_x_line_color"];
        _moveTo(0, pxOriginY);
        _lineTo(pxWidth, pxOriginY);
        context.stroke();

        // draw x axis arrow
        context.beginPath();
        context.fillStyle = styles["axis_x_line_color"];
        _moveTo(pxWidth, pxOriginY);
        _lineTo(pxWidth - 10, pxOriginY - 5);
        _lineTo(pxWidth - 5, pxOriginY);
        _lineTo(pxWidth - 10, pxOriginY + 5);
        context.fill();
    }

    function _drawAxisY() {

        // draw y axis
        context.beginPath();
        context.strokeStyle = styles["axis_y_line_color"];
        _moveTo(pxOriginX, 0);
        _lineTo(pxOriginX, pxHeight);
        context.stroke();

        // draw y axis arrow
        context.beginPath();
        context.fillStyle = styles["axis_y_line_color"];
        _moveTo(pxOriginX, 0);
        _lineTo(pxOriginX - 5, 10);
        _lineTo(pxOriginX, 5);
        _lineTo(pxOriginX + 5, 10);
        context.fill();
    }

    function _drawFunc(_f, color) {

        if(color) {
            context.strokeStyle = color;
        } else {
            context.strokeStyle = styles["curve_color"];
        }
        
        context.beginPath();

        var lineWidthBackup = context.lineWidth;
        context.lineWidth = 2;

        for(var x = 0; x <= pxWidth; x+=config.detailLevel) {

            var ux = rangeX[0] + _pxToUnitsX(x);
            var uy = _f(ux);

            if(null == uy) { // special case for animations
                continue;
            }

            var y = pxOriginY - _unitsToPxY(uy);

//            console.debug(ux + " => " + uy);
//            console.debug(x + "px => " + y + "px");

            if(0 == x) {
                _moveTo(x, y);
            } else {
                _lineTo(x, y);
            }
        }
        context.stroke();

        context.lineWidth = lineWidthBackup;
    }

    function _clear(){
        _fillBackground();
        _drawGrid();
        _drawAxis();
    }

    this.render = _drawFunc;
    this.clear = _clear;
}
