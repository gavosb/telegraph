import React from 'react';
import '../App.css';
import logo from '../logo.png';
import ServerBrowser from './ServerBrowser.js';
import Room from './Room.js';

const Home = () => {
  let [currentComponent, setCurrentComponent] = React.useState("ServerBrowser");
  

  const getCurrentComponent = () => {
    let component;
    switch (currentComponent){
        case 'ServerBrowser' :
          component = <ServerBrowser setParentComponent = {changeCurrentComponent}/>;
          break;
        case 'Room' :
          component = <Room setParentComponent = {changeCurrentComponent} indicator = {true}/>;
          break;
        case 'RoomJoined' :
          component = <Room setParentComponent = {changeCurrentComponent} indicator = {false}/>;
          break;
    }
    return component;
  }

  const changeCurrentComponent = (component) => {
    setCurrentComponent(component);
  }
    return (
      
        <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>G.C. Osborn's Telegraph</h2>
        </div>
        {getCurrentComponent()}
      </div>
    );
}
 
export default Home;
