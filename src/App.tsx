import './master.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import {
  Home,
  TopBar,
  SideBar,
  Brands,
  Database,
  Builder,
  ProfilePage
} from './assets/pages';

import { CustListView, CustomerCards, TableComponent } from './assets/view-components';

function App() {
  
  return (
    <>
      <Router>
        <TopBar />
        <SideBar />
        <div id="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/database" element={<Database />} />
            <Route path="/build" element={<Builder />} />
            <Route path="/profile/:customerID" element={<ProfilePage />}>
              <Route index element={<CustomerCards />} />
              <Route path="card" element={<CustomerCards />} />
              <Route path="list" element={<CustListView />} />
            </Route>
          </Routes>
        </div>
      </Router >
    </>
  )
}

export default App
