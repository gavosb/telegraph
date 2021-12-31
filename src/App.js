import React, { Component } from 'react';
import './App.css';
import Home from './components/Home';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <div>
        <Home />
        <Footer />
      </div>
    );
  }
}

export default App;
