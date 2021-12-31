import React from 'react';
import '../App.css';
import logo from '../logo.png';
import ServerBrowser from './ServerBrowser.js';
import Room from './Room.js';

/*
  The Home Component - Serves as the basis for all other components and to which they all aspire.
  Different "pages" (components) can be flipped through here with currentComponent.
*/
const Home = () => {
  let [currentComponent, setCurrentComponent] = React.useState("ServerBrowser"); //hook's currentComponent State
  
  /*
    Returns the actual component to be displayed, using the currentComponent state.
    {indicator} is passed down to Room to tell it whether it is a new room or a joined one.
  */
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
  
  /*
    Changes the currentComponent state.
    parameter must be of the following options:
    'ServerBrowser', 'Room', 'RoomJoined'
    @param component
  */
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
