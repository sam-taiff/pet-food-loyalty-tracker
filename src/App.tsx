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
  TopNavBar,
  SideNavBar,
  Brandpage,
  Databasepage,
  Profilepage
} from './assets/pages';

function App() {
  return (
    <>
      <Router>
        <TopNavBar />
        <SideNavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/brands" element={<Brandpage />} />
        <Route path="/database" element={<Databasepage />} />
        <Route path="/profile" element={<Profilepage />} />
      </Routes>
    </Router >
    </>
  )
}

export default App
