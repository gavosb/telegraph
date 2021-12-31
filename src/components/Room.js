import React from 'react';
import '../App.css';
import Peer from "peerjs";
import Home from './Home';
const fs = require('fs')
const Room = ({indicator}) => {
  
    let text = "memes";
    let dash = fs.readFileSync('./dash.txt');
    let dot = fs.readFileSync('./dot.txt');
    console.log("Room spawn");
    if (indicator){
        console.log("room created");
    }
    // types: 0 (dash) 1 (dot)
    const send = (type) => {
        conn.send(type);
        playSound(type);
        console.log(peer.id, " - sending: ", type)
    }
    const changeConnection = (conn) => {

        console.log("remember");
        //setConnection(conn);
      }
    const peer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4,0), {
        host: location.hostname,
        port: 9000, //port of signalling server
        debug: 1,
        path: '/',
        config: { 'iceServers': [
            { 'urls': 'stun:stun.l.google.com:19302' }  
          ] }
        
    });

    window.peer = peer;


    peer.on('open', function () {
        if (indicator){
            alert(`Your device ID is: ${peer.id}`);
        }
    });

    let code;
    function getStreamCode() {
        code = window.prompt('Enter the transmission code:');
    }
    let conn;
    function connectPeers() {
        conn = peer.connect(code);
        changeConnection(conn);
        console.log("connection established");
        
        
    }
    let startTime = Date.now();
    let chatFormatting = false;
    const printToChat = (printVar) => {
        let chat = document.getElementById("Chat");
        const newDate = Date.now();
        const elapsedTime = ((newDate - startTime) / 1000); //in seconds, unrounded
        if (elapsedTime >= 5){
            chat.innerHTML += '<br>';
        } else if (elapsedTime >= 1.5 && chatFormatting){
            chat.innerHTML += " / ";
        }else if (elapsedTime >= 0.6 && chatFormatting){
            chat.innerHTML += "  ";
        }
        startTime = newDate;
        chat.innerHTML += printVar;
    }

    function playSound(snd){
        let sound = "";
        switch (snd){
            case 1:
                sound = dot;
                printToChat('.');
                
                break;
            case 0:
                sound = dash;
                printToChat('-')
                break;
            default:
                sound = dot;
                console.log("invalid sound, defaulting to dot");
                break;
        }
        let audio = new Audio('data:audio/ogg;base64,' + sound);
        audio.play();
    }
    function connListener(){
        conn.on('open', function() {
            console.log(conn);
            // Receive messages
            conn.on('data', function(data) {
                console.log('Received', data);
                console.log("data received");
                if (data != "disconnect"){
                    playSound(data);
                }else{
                    peer.disconnect();
                }
                
              });
            conn.on('close', function(){
                goHome();
            });
            // Send messages
            conn.send("hi lol");
            if (!indicator){
                send("disconnect");
                peer.disconnect();
              }
          });
          
    }
    peer.on('connection', function(connection){
        conn = connection;
        console.log("peer.on");
        connListener();
        document.getElementById("peerCode").innerHTML = "Peer ID: " + conn.peer;
          
    });
    peer.on('disconnected', function(){
        console.log("disconnected");
    });
    if (!indicator){
        getStreamCode();
        
    }else{
        code = peer.id;
    }
    connectPeers();
    connListener();
    
    window.addEventListener('keydown', function(event) {
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        if (key === "ArrowRight"){
            send(0);
        }else if (key === "ArrowLeft"){
            send(1);
        }
    });
    
    const toggleChat = () => {
        console.log("test");
        let chat= document.getElementById("Chat");
        chat.hidden = !chat.hidden ;
    }

    const toggleChatFormatting = () => {
        chatFormatting = !chatFormatting;
    }
    const goHome = () => {
        conn.close();
        peer.destroy();
        document.location.reload(true);
    }
    //of course, proper style would have error checking all over peer ID.
    return (
        <div>
            <p>
            Use the left arrow key to send a dot, and the right arrow key to send a dash. Otherwise, use the buttons accordingly.
            </p>
            <div hidden='true' className='Chat' id="Chat" />
            
            <div>
            <button id="dotButton" className='Key-Button' onClick={() => send(1)}>.</button>
            <button id = "dashButton" className='Key-Button' onClick={() => send(0)}>-</button>
            </div>
            <div>
            <label for="toggleChatting">Logging</label>
            <input id="toggleChatting" type="checkbox" onClick={() => toggleChat()}/>
            <label className="Formatting-Button" for="toggleFormatting">Log Formatting</label>
            <input id="toggleFormatting" type="checkbox" onClick={() => toggleChatFormatting()}/>
            <button className="Disconnect-Button" onClick={() => goHome()}>Disconnect</button>
            </div>

            <div>
            <p style={{display: "inline"}} id="selfCode">Client ID: {peer.id} | </p>
            <p style={{display: "inline"}} id="peerCode">Peer ID: {conn.peer}</p> 
            </div>

        </div>
       
    );
}
 
export default Room;
