
import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { ethers } from "ethers";

import Home from './pages/Home/Home';
import Create from './pages/Create/Create';
import Token from './pages/Token/Token';
import Header from './components/Header/Header';
import { rpc } from './contractdetails/contractdetails';
import factorycontract from './actions/factorycontract';



export const stateContext = createContext();

const provider = new ethers.providers.JsonRpcProvider(rpc)

const initialState = {
  erc20factory: factorycontract(provider),
  signer: null
}

const reducer = async (state, action) => {
  switch (action.type) {
    case 'login':
      return action.payload;
    default:
      return state;
  }
}

function App() {

  const [_state, dispatch] = useReducer(reducer, initialState);



  return (
    <stateContext.Provider value={{
      appState: _state,
      appDispatch: dispatch
    }}>
      <Router>
        <Header />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/create' element={<Create />} />
          <Route exact path='/token/:address' element={<Token />} />
        </Routes>
      </Router>
    </stateContext.Provider>
  );
}

export default App;
