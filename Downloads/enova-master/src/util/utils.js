/**
 * 
 * @param {*} xPixel 
 * @param {*} canvasWidth 
 * @param {*} xmin 
 * @param {*} xmax 
 * @returns 
 * return cooord in pixel canvas
 */
function newRepereX(xPixel, canvasWidth, xmin, xmax) { return canvasWidth * (xPixel - xmin) / (xmax - xmin); }

function newRepereY(yPixel, canvasHeight, ymin, ymax) { return canvasHeight - canvasHeight * (yPixel - ymin) / (ymax - ymin); }

function coordMeter2Pixel(coordX, coordY, canvasWidth, canvasHeight, pgmWidth, pgmHeight) {
    let xPixels = (canvasWidth * coordX) / pgmWidth;
    let yPixels = (canvasHeight * coordY) / pgmHeight;
    return { xPixels, yPixels }
}


export { newRepereX, newRepereY, coordMeter2Pixel };