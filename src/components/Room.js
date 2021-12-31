import React from 'react';
import '../App.css';
import Peer from "peerjs";
import Home from './Home';
const fs = require('fs')

/*
  The Room component, displays the Room page. Holds transmission buttons, a disconnect button, and a chat log.
  All of the WebRTC logic is trapped in here for ease of use, and also since it's relatively short and self-contained within the room.
  The {indicator} prop is passed down from Home, which tells us if the client is joining a room or creating a new one.
  This is used for determing when to shut off the connection to the signalling server, removing the peers from the server browser.
*/
const Room = ({indicator}) => {
  
    let dash = fs.readFileSync('./dash.txt'); //double check file paths if anything goes wrong
    let dot = fs.readFileSync('./dot.txt');
  
    // types: 0 (dash) 1 (dot)
    // Sends data over DataConnection
    const send = (type) => {
        conn.send(type);
        playSound(type);
    }
    
    //Creates a new connection to the signalling server
    const peer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4,0), {
        host: location.hostname,
        port: 9000, //port of signalling server
        debug: 1,
        path: '/',
        config: {} // example, a stun server for aiding connection (not necessary): 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] 
        
    });

    window.peer = peer;

    //On connection established
    peer.on('open', function () {
        if (indicator){ //indicator, therefor the peer created the room. Show them their ID. If you find this annoying, remove it.
            alert(`Your device ID is: ${peer.id}`);
        }
    });

    let code;
    //Sets code to the ID of the peer.
    function getTransmissionCode() {
        code = window.prompt('Enter the transmission code:');
    }
    let conn;
    //Connects two peers, setting conn to a DataConnection
    function connectPeers() {
        conn = peer.connect(code);
    }
  
    let startTime = Date.now();
    let chatFormatting = false;
    /*
      Handles logging and log formatting. Called playSound()
      @param printVar the character to be logged
    */
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
    
    //plays a Base64 encoding as a sound
    //If not a 1 or 0, defaults to playing a dot sound.
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
    
    /*
      Establishes listeners for the peer - and disconnects peers from server once listeners established
    */
    function connListener(){
        conn.on('open', function() {
            // Receive messages
            conn.on('data', function(data) {
                if (data != "disconnect"){
                    playSound(data);
                }else{
                    peer.disconnect();
                }
                
              });
            conn.on('close', function(){
                goHome();
            });
            //disconnects peers from server, here due to async issues
            if (!indicator){
                send("disconnect");
                peer.disconnect();
              }
          });
          
    }
    //On connection, sets conn to the PeerConnection and prints their ID to the document.
    peer.on('connection', function(connection){
        conn = connection;
        document.getElementById("peerCode").innerHTML = "Peer ID: " + conn.peer;
          
    });
  
    //Unused besides logging when a peer disconnects to the signalling server.
    //Note: On disconnection from the server, dataConnections and others remain intact because of p2p.
    peer.on('disconnected', function(){
        console.log("disconnected");
    });
    if (!indicator){ //if joining a room, ask for the code
        getTransmissionCode();
        
    }else{
        code = peer.id; //otherwise, set code to peer id
    }
    connectPeers();
    connListener();
    
    //maps keys to send() functions
    window.addEventListener('keydown', function(event) {
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        if (key === "ArrowRight"){
            send(0);
        }else if (key === "ArrowLeft"){
            send(1);
        }
    });
    
    //toggles log
    const toggleChat = () => {
        console.log("test");
        let chat= document.getElementById("Chat");
        chat.hidden = !chat.hidden ;
    }
    
    //toggles log formatting
    const toggleChatFormatting = () => {
        chatFormatting = !chatFormatting;
    }
    
    //completely disconnects from server and closes connection.
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
