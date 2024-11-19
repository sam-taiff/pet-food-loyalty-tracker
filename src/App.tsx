import React from 'react'
import { useState } from 'react'
import './master.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  Home,
  TopBar,
  SideNavBar,
  Brands,
  Database,
  Builder,
  ProfilePage
} from './assets/pages';

function App() {
  return (
    <>
      <Router>
        <TopBar />
        <SideNavBar />
        <div id="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/database" element={<Database />} />
            <Route path="/build" element={<Builder />} />
            <Route path="/profile/:customerID" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router >
    </>
  )
}

export default App
