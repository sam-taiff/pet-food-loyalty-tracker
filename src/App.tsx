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
  TopBar,
  SideNavBar,
  Brandpage,
  Databasepage,
  Profilepage,
  PageProps
} from './assets/pages';

function App() {
  return (
    <>
      <Router>
        <TopBar pageName={} />
        <SideNavBar />
      </Router >
    </>
  )
}

export default App
