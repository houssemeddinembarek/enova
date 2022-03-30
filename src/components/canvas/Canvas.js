import React, { useRef, useEffect, useState } from "react";
import mqtt from "mqtt";
import mapImage from "./test.svg";
import options from "../../config/index";
import { newRepereX, newRepereY, coordMeter2Pixel } from "../../util/utils";
const Canvas = () => {

  const [message, setMessage] = useState("");
  const [messagee, setMessagee] = useState("");
  const [coordX, setCoordX] = useState()
  const [coordY, setCoordY] = useState()
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState();
  const [$svg, set$Svg] = useState();
  const [ctx, setCtx] = useState();
  const [xmin, setXmin] = useState(-647);
  const [xmax, setXmax] = useState(405);
  const [ymin, setYmin] = useState(-423);
  const [ymax, setYmax] = useState(628);
  // const [pgmWidth, setPgmWidth] = useState();
  // const [pgmHeight, setPgmHeight] = useState();
  const [canvasWidth, setCanvasWidth] = useState();
  const [canvasHeight, setCanvasHeight] = useState();
  const [xPixels, setXPixels] = useState();
  const [yPixels, setYPixels] = useState();

  // const [canvas, setCanvas] = useState();

  let rectWidth = 50
  let rectHeight = 50
  /**
   * make the mqtt connection
   */
  useEffect(() => {
    const client = mqtt.connect("ws://192.168.3.128:8083/mqtt", options)
    if (client) {
      client.on('connect', () => {
        client.subscribe("aa", function (err) {
          if (err) {
            console.log(err)
          }
        })
      });
      client.on('error', (err) => {
        if (err) {
          console.error('Connection error: ', err);
          client.end();
        }
      });
      client.on('reconnect', () => {
        console.log('Reconnecting');
      });
      client.on('message', (topic, message) => {
        let posObj = (JSON.parse(message))
        console.log(posObj.position)

        setCoordX(posObj.position.x)
        setCoordY(posObj.position.y)

      });
      // setCoordX(-5.9)
      // setCoordY(5.0)
      // setCoordX(-5.9)
      // setCoordY(5.0)
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvas(canvasRef.current);
    setCtx(canvas.getContext('2d'));
    set$Svg(document.getElementById("svg"));
    setCanvasWidth(canvas.width);
    setCanvasHeight(canvas.height);

  }, [canvas, ctx])

  const getTransformParameters = (element) => {
    const transform = element.style.transform;

    let scale = 1,
      x = 0,
      y = 0;

    if (transform.includes("scale")) {

      // console.log((transform.indexOf("translateY")));
      scale = parseFloat(transform.slice(transform.indexOf("scale") + 6));
    }
    if (transform.includes("translateX"))
      x = parseInt(transform.slice(transform.indexOf("translateX") + 11));
    if (transform.includes("translateY"))
      y = parseInt(transform.slice(transform.indexOf("translateY") + 11));

    return { scale, x, y };
  };
  const getTransformString = (scale, x, y) => `scale(${scale}) translateX(${x}px) translateY(${y}px)`;

  const pan = (direction) => {
    const { scale, x, y } = getTransformParameters($svg);
    console.log(scale, x, y);
    console.log("xPixel", xPixels)
    console.log("yPixel", yPixels)

    let dx = 0,
      dy = 0;
    switch (direction) {
      case "left":
        dx = -3;
        // ctx.clearRect(newRepereX(xPixels, canvasWidth, xmin, xmax), newRepereY(yPixels, canvasHeight, ymin, ymax), rectWidth, rectHeight);
        ctx.translate(dx, 0)
        setXPixels(xPixels + dx)
        break;
      case "right":
        dx = 3;
        ctx.clearRect(newRepereX(xPixels), newRepereY(yPixels), rectWidth, rectHeight);
        setXPixels(xPixels + dx)
        ctx.translate(dx, 0)
        break;
      case "up":
        dy = -3;
        ctx.clearRect(newRepereX(xPixels), newRepereY(yPixels), rectWidth, rectHeight);
        setYPixels(yPixels + dy)
        ctx.translate(0, dy)
        break;
      case "down":
        dy = 3;
        ctx.clearRect(newRepereX(xPixels), newRepereY(yPixels), rectWidth, rectHeight);
        setYPixels(yPixels + dy)
        ctx.translate(0, dy)
        break;
      default:
        break;
    }
    $svg.style.transform = getTransformString(scale, x + dx, y + dy);
  };



  const zoom = (direction) => {
    const { scale, x, y } = getTransformParameters($svg);
    let dScale = 0.1;


    if (direction === "out") {

    }

    dScale *= -1;

    if (scale === 0.1 && direction === "out") dScale = 0;


    $svg.style.transform = getTransformString(scale + dScale, x, y);

  };

  function drawTranslated() {
    // ctx.clearRect(0, 0, Width, Height);
    // ctx.clearRect(0, 0, Width, Height);
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.scale(scaleFactor, scaleFactor);

    ctx.restore();


  };

  let scaleFactor = 1.00;
  function zoomIn() {
    scaleFactor *= 1.1;
    drawTranslated();
  };

  function zoomOut() {
    scaleFactor /= 1.1;
    drawTranslated();
  };


  // let aux = 0;
  // const rotate = (ii) => {
  //   aux = aux + ii;
  //   console.log(ii);
  //   $svg.style.transform = "rotate(" + aux + "deg) ";

  // };
  useEffect(() => {
    if (canvas) {

      ctx.clearRect(0, 0, canvasWidth + 20, canvasHeight + 20);
      let { xPixels, yPixels } = coordMeter2Pixel(coordX, coordY, canvasWidth, canvasHeight, 52.8, 52.8)
      setXPixels(xPixels)
      setYPixels(yPixels)
      ctx.fillRect(newRepereX(xPixels, canvasWidth, xmin, xmax), newRepereY(yPixels, canvasHeight, ymin, ymax), 5, 5);
    }
  });


  const zommOp = () => {
    zoom("in")
    zoomIn()
  }


  return (
    <div className="container">
      <div className="container row">
        <button id="left-button" onClick={() => pan("left")} >left</button>
        <button id="right-button" onClick={() => pan("right")}>right</button>
        <button id="up-button" onClick={() => pan("up")}>up</button>
        <button id="down-button" onClick={() => pan("down")}>down</button>
        <button id="zoom-in-button" onClick={() => zoom("in")}>zoom-in</button>
        <button id="zoom-out-button" onClick={() => zoom("out")}>zoom-out</button>
        <button id="rotate">rotate</button>

      </div>
      <div className="svg-container">
        <img id="svg" src={mapImage} alt="image problem" />
        <canvas id="myCanvas" ref={canvasRef} width="1055" height="1055">
        </canvas>

      </div>
    </div>

  );

}

export default Canvas

