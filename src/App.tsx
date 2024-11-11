import React from 'react'
import { useState } from 'react'
import './master.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  Homepage,
  NavBar,
  Brandpage,
  Databasepage
} from './assets/pages';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/brands" element={<Brandpage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
