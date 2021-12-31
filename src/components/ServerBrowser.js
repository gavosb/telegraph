import React from 'react';
import '../App.css';



const ServerBrowser = ({setParentComponent}) => {
    
    let codes = [];

    async function getPeers (){
        let obj;
        const response = await fetch("https://"+location.hostname + ":9000/pecker/peers");
        codes = await response.json();
        codes.forEach(element => {
            document.getElementById('browser').innerHTML += ('<br><li> ID: '+element+'</li>');
        });
    }
    getPeers();
    return (
        <div>
            <p className="App-intro">
            Open Transmissions:
            </p>
            <ul id = "browser" className="Server-browser"></ul>

            <button className="Join-Button" onClick={() => setParentComponent('Room')}>New Transmission</button>
            <button className="Join-Button" onClick={() => setParentComponent('RoomJoined')}>Connect by ID</button>
            
        </div>
       
    );
}
 
export default ServerBrowser;
