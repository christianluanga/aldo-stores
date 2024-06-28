import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Modal from 'react-modal';
import Routes from './routes';
import Navbar from './components/NavBar';
import Footer from './components/Footer';


Modal.setAppElement('#root');

const App = ()=> {
  return (
    <Router>
      <Navbar />
      <Routes />
      <Footer />
    </Router>
  );
}

export default App;
