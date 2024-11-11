import React from 'react';
import '../master.css';
import './brandSVG.tsx';
import logo from './sparrow.png';
import {
    Home
} from "flowbite-react-icons/solid";
import {
    BarsFromLeft
} from "flowbite-react-icons/outline";
import {
    Outlet,
    Link,
    useHref
} from "react-router-dom";

//Navigation Bar
export const NavBar = () => {
    return (
        <div className='topbar'>
            <img src={logo} id="logo" />
            <a title="Back to Homepage" href='/'><span className='topbar item'>Loyalty Card Tracking</span></a>
        </div>
    )
}

//Home Page
export const Homepage = () => (
    <div>
        <search>
            <form>
                <input
                    autoComplete='off'
                    autoFocus
                    type="search"
                    id="search-input"
                    name="cust-search"
                    spellCheck="false"
                    placeholder='Search Customer'
                />
            </form>
        </search>
        <div id="main-menu"> {/* main menu action buttons */}
            <a><button>View Database</button></a>
            <a title="Brands Page" href="/brands"><button>Manage Brands</button></a>
            <a><button>New Purchase</button></a>
        </div>
        <div id="due-view"> {/* viewport of all "due cards" */}
            <div id="filter-due">some more text</div>
            <div id="due-cards">some text</div>
        </div>
    </div>
);

//Profile Page
export const Profile = () => {
    const variable = 3;
    return (
        <div>
            <h1>{variable}</h1>
            <Outlet />
        </div>
    );
};

//Manage Brands Page
export const Brandpage = () => <h1>Registered Brands</h1>;

//Database Page
export const Databasepage = () => <h1>Database</h1>;