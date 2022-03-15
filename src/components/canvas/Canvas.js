import React, { useRef, useEffect, useState } from "react";
import mqtt from "mqtt";
export default function Canvas() {

  const [message, setMessage] = useState("");
  const [messagee, setMessagee] = useState("");
  const [msg, setMsg] = useState("");
  const [msgg, setMsgg] = useState("");
  const [coordX, setCoordX] = useState()
  const [coordY, setCoordY] = useState()









  // const mqttConnect = (host, mqttOption) => {
  //   setConnectStatus('Connecting');
  //   setClient(mqtt.connect(host, "ws://test.mosquitto.org:8080"));
  // };


  const client = mqtt.connect("ws://test.mosquitto.org:8080")
  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        // setConnectStatus('Connected');
        client.subscribe("aa", function (err) {
          console.log(err)
        })
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        // setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        let posObj =(JSON.parse(message))
        console.log(posObj.position.x)

        setCoordX(posObj.position.x)
        setCoordY(posObj.position.y)
        // const payload = { topic, message: message.toString() };
        // setPayload(payload);
      });
    }
  }, [client]);












  const canvasRef = useRef(null);
  var x = 100;
  var y = 100;

  var w = 5;
  var h = 5;







  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let xmin = -647
    let xmax = 408
    let ymin = -424
    let ymax = 631


    let Width = canvas.width;
    let Height = canvas.height;
    function cnv2x(X) { return X * (xmax - xmin) / Width + xmin; }
    function cnv2y(Y) { return (Height - Y) * (ymax - ymin) / Height + ymin; }
    function x2cnv(x) { return Width * (x - xmin) / (xmax - xmin); }
    function y2cnv(y) { return Height - Height * (y - ymin) / (ymax - ymin); }
    function Plot_axes() {
      // Nouveaux axes:
      ctx.beginPath();
      ctx.moveTo(x2cnv(0), y2cnv(ymin)); ctx.lineTo(x2cnv(0), y2cnv(ymax));
      ctx.moveTo(x2cnv(xmin), y2cnv(0)); ctx.lineTo(x2cnv(xmax), y2cnv(0));
      ctx.stroke();
      // Affichage des valeurs min et max aux extrémités des axes:
      ctx.fillText(xmin, x2cnv(xmin), y2cnv(0));
      ctx.fillText(xmax, x2cnv(xmax) - 12, y2cnv(0));
      ctx.fillText(ymin, x2cnv(0), y2cnv(ymin) - 2);
      ctx.fillText(ymax, x2cnv(0), y2cnv(ymax) + 10);
    }


    
   
    // On retrace les axes
    // Plot_axes();
   
    ctx.clearRect(0, 0, Width, Height);
   let X = (608 * coordX) / 30.4;
    let Y = (832 * coordY) / 41.6;


    setMessage("(X,Y) = (" + X + " ; " + Y + ")");
    let a = Math.round(cnv2x(X) * 100) / 100;
    let b = Math.round(cnv2y(Y) * 100) / 100;
    setMessagee("(x,y) = " + "(" + a + "," + b + ")");
    ctx.fillRect(x2cnv(X), y2cnv(Y), 5, 5);

    // function MouseClickDown(e) {
    //   let X = e.pageX - canvas.offsetLeft;
    //   let Y = e.pageY - canvas.offsetTop;
    //   ctx.clearRect(0, 0, Width, Height);
    //   // On retrace les axes
    //   // Plot_axes();
     
    //   ctx.clearRect(0, 0, Width, Height);
    //   X = (608 * 4) / 30.4;
    //   Y = (832 * 4) / 41.6;


    //   setMessage("(X,Y) = (" + X + " ; " + Y + ")");
    //   let a = Math.round(cnv2x(X) * 100) / 100;
    //   let b = Math.round(cnv2y(Y) * 100) / 100;
    //   setMessagee("(x,y) = " + "(" + a + "," + b + ")");
    //   ctx.fillRect(x2cnv(X), y2cnv(Y), 5, 5);

    // }

    // canvas.onmousedown = MouseClickDown;



    // ctx.fillRect(0, 0, w, h);
    //ctx.fillRect(318,266,10,10);
    //ctx.fillRect(56.52,72.26,10,10);
    // play with arrows

  },[coordX,coordY]);





  return (
    <div>
      <canvas id="canvas" ref={canvasRef} height="1055px" width="1055px" />
      <p>{message}</p>
      <p>{messagee}</p>

    </div>
  );

}

