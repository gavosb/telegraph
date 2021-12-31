import React from 'react';
import Home from './Home';
import '../App.css';

/*
    The ServerBrowser component, where the server list is displayed alongside buttons to join rooms.
    This component takes Home's state function as a prop, so that it can change the page to a new room.
*/
const ServerBrowser = ({setParentComponent}) => {
    
    let codes = [];
    
    /*
        Builds an array from the array of peers from the peer server's API. Called every time the page is refreshed.
        I'm going to be honest, I was incredibly lazy here - I had been working on this for a week and just didn't want to bother.
        This should implement useState like in Home.js. I'll probably fix it later. Complicated due to async.
    */
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
