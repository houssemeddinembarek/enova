import React , {Component}  from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Canvas from './components/canvas/Canvas';
//import mqtt from 'mqtt';


class  App extends Component {

  componentDidMount(){
  //   var topic = 'LINTANGtest123';
  //   var client = mqtt.connect('mqtt://localhost:1234');
  //   client.on('connect',()=>{
  //     client.subscribe(topic);
  //     console.log("subscribed") ;   
  //   })

  //   client.on('message',(topic,message)=>{
  //     message = JSON.parse(message);
  //     console.log(message);
  //     console.log(message.x);
  // })

  }



  render(){
    return (
    
        <Router>
           <Routes>
             <Route exact path="/" />
             <Route exact path="/canvas" element={<Canvas/>}/>
           </Routes>
         </Router>
        
      );
  }
 }


export default App;
