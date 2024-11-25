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
import { routes } from './routes';

import { CustListView, CustomerCards, TableComponent } from './assets/view-components';

function App() {

  return (
    <Router>
      <TopBar routes={routes} />
      <SideBar />
      <div id="page">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {/* Nested routes for /profile/:customerID */}
          <Route path="/profile/:customerID">
            <Route index element={<CustomerCards />} />
            <Route path="card" element={<CustomerCards />} />
            <Route path="list" element={<CustListView />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App
