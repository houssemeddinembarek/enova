import React, { useRef, useEffect, useState } from "react";
import mqtt from "mqtt";
import image from "./test.svg";
const Canvas = () => {

  const [message, setMessage] = useState("");
  const [messagee, setMessagee] = useState("");
  const [coordX, setCoordX] = useState()
  const [coordY, setCoordY] = useState()
  const [canvas, setCanvas] = useState()
  const [svg, setSvg] = useState()
  const canvasRef = useRef(null);
  const svgRef = useRef(null);



  const options = {
    keepalive: 30,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
    rejectUnauthorized: false
  };

  useEffect(() => {
    const client = mqtt.connect("ws://192.168.3.128:8083/mqtt", options)
    if (client) {

      client.on('connect', () => {
        // setConnectStatus('Connected');
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
        // const payload = { topic, message: message.toString() };
        // setPayload(payload);
      });
    }
  }, []);










  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const svg = document.getElementById("svg");
    let xmin = -647
    let xmax = 405
    let ymin = -423
    let ymax = 628

    let Width = canvas.width;
    let Height = canvas.height;
    let rectW = 50
    let rectH = 50
    function x2cnv(x) { return Width * (x - xmin) / (xmax - xmin); }
    function y2cnv(y) { return Height - Height * (y - ymin) / (ymax - ymin); }
    ctx.clearRect(0, 0, Width + 20, Height + 20);
    let xPixels = (1055 * coordX) / 52.8;
    let yPixels = (1055 * coordY) / 52.8;

    ctx.fillRect(x2cnv(xPixels), y2cnv(yPixels), 5, 5);
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

    const getTransformString = (scale, x, y) =>
      "scale(" + scale + ") " + "translateX(" + x + "px) translateY(" + y + "px)";

    const pan = (direction) => {
      const { scale, x, y } = getTransformParameters(svg);
      let dx = 0,
        dy = 0;
      switch (direction) {
        case "left":
          dx = -3;
          console.log(dx)
          break;
        case "right":
          dx = 3;
          break;
        case "up":
          dy = -3;
          break;
        case "down":
          dy = 3;
          break;
      }
      svg.style.transform = getTransformString(scale, x + dx, y + dy);
    };
    const saw = (direction) => {

      let dx = 0,
        dy = 0;
      switch (direction) {
        case "left":

          dx = -3;
          console.log(dx)
          ctx.clearRect(x2cnv(xPixels), y2cnv(yPixels), rectW, rectH);
          xPixels = xPixels + dx
          ctx.translate(dx, 0)
          break;
        case "right":
          dx = 3;
          console.log(dx)
          ctx.clearRect(x2cnv(xPixels), y2cnv(yPixels), rectW, rectH);
          xPixels = xPixels + dx
          ctx.translate(dx, 0)
          break;
        case "up":
          dy = -3;
          ctx.clearRect(x2cnv(xPixels), y2cnv(yPixels), rectW, rectH);
          yPixels = yPixels + dy
          ctx.translate(0, dy)
          break;
        case "down":
          dy = 3;
          ctx.clearRect(x2cnv(xPixels), y2cnv(yPixels), rectW, rectH);
          yPixels = yPixels + dy
          ctx.translate(0, dy)
          break;
      }

    };

    let a = 0;
    const zoom = (direction) => {

      const { scale, x, y } = getTransformParameters(svg);
      let dScale = 0.1;

      if (direction == "out")

        dScale *= -1;

      if (scale == 0.1 && direction == "out") dScale = 0;
      svg.style.transform = getTransformString(scale + dScale, x, y);

    };

    let scaleFactor = 1.00;

    //    function zoomIn() {
    function zoomIn() {
      scaleFactor *= 1.1;
      drawTranslated();
    };

    function zoomOut() {
      scaleFactor /= 1.1;
      drawTranslated();
    };

    function drawTranslated() {
      //ctx.clearRect(0,0,Width,Height);
      //ctx.clearRect(0, 0, Width, Height);
      ctx.save();
      ctx.translate(Width / 2, Height / 2);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.fillRect(x2cnv(xPixels) - Width / 2, y2cnv(yPixels) - Height / 2, 5, 5);
      ctx.restore();


    };

    /*const zoomctx = (direction) => {
      
      let a = 1
      
      ctx.clearRect(x2cnv(xPixels),y2cnv(yPixels), 50,50)
      
      ctx.fillRect(x2cnv(xPixels),y2cnv(yPixels), 5,5);
    };*/
    let aux = 0;
    const rotate = (ii) => {
      aux = aux + ii;
      console.log(ii);
      svg.style.transform = "rotate(" + aux + "deg) ";

    };
    document.getElementById("left-button").onclick = () => {
      pan("left"); saw("left")
    };
    document.getElementById("right-button").onclick = () => { pan("right"); saw("right") }
    document.getElementById("up-button").onclick = () => { pan("up"); saw("up") }
    document.getElementById("down-button").onclick = () => { pan("down"); saw("down") }

    document.getElementById("zoom-in-button").onclick = () => { zoom("in"); zoomIn() }
    // document.getElementById("zoom-out-button").onclick = () => rotate(10);
    document.getElementById("zoom-out-button").onclick = () => { zoom("out"); zoomOut() }
    document.getElementById("rotate").onclick = () => rotate("5");




  }, [coordX, coordY]);





  return (
    <div className="container">
      <div className="container row">
        <button id="left-button">left</button>
        <button id="right-button">right</button>
        <button id="up-button">up</button>
        <button id="down-button">down</button>
        <button id="zoom-in-button">zoom-in</button>
        <button id="zoom-out-button">zoom-out</button>
        <button id="rotate">rotate</button>

      </div>
      <div className="svg-container">
        <img id="svg" src={image} />
        <canvas id="myCanvas" ref={canvasRef} width="1055" height="1055">
        </canvas>
        <p>{message}</p>
        <p>{messagee}</p>
      </div>
    </div>

  );

}

export default Canvas

