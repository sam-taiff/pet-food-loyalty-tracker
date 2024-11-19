import '../master.css';
import logo from './sparrow.png';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { TableComponent, VertTable, BrandCards, CurrentProfile, CustomerCards, useSupabaseSearch } from './view-components.tsx';
import React, { useEffect, useState } from 'react';
import { database } from "./client.ts";

//placeholder text (DEV USE ONLY)
const lorem: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lectus dui, rutrum sit amet nibh et, consectetur consequat metus. Nunc ultricies enim nec suscipit mollis. Praesent hendrerit, neque nec porta semper, sem tellus venenatis mi, vel sollicitudin tortor elit in libero. Etiam vitae enim eu velit aliquam fringilla. Mauris eleifend ante nisi, sit amet imperdiet purus sodales vitae. Ut posuere rhoncus quam nec dapibus. Proin ullamcorper mauris et lorem dignissim vehicula vitae mattis orci. In eu pulvinar ex. Curabitur euismod tellus quis enim condimentum vehicula. Fusce ac placerat nisi, in ultrices elit. Nulla fringilla ultrices eros, ut dictum felis luctus in. Donec pulvinar tempor felis, sit amet dignissim metus. Maecenas lectus erat, tempor vitae turpis vel, vulputate ultrices nisi."
//Navigation Bar
export const TopBar = () => {
    const pageName = "";
    return (
        <div id='topbar'>
            <img src={logo} id="logo" />
            <a title="Back to Homepage" href='/'>
                <span>Loyalty Card Tracking</span>
            </a>
            {/* <span className='topbar item' id="cust-name">{pageName}</span> */}
        </div>
    )
}

export const SideNavBar = () => {
    return (
        <div id="sidenav">
            <a title="Loyalty Card Tracking Home" href="/">Home</a>
            <a title="View Database" href="/database">Database</a>
            <a title="Brands Page" href="/brands">Brands</a>
            <a>New Purchase</a>
            <a href="/profile">Temp: Profile</a>
            <a href="/build">Temp: Builder</a>
        </div>
    )
}

//Search
export const SearchnResults = () => {
    const [searchTerm, setSearchTerm] = useState<string>(""); // Actual input value
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(""); // Debounced value
    const [activeIndex, setActiveIndex] = useState<number>(-1); // Track the active result index
    const { results, loading, error } = useSupabaseSearch(debouncedSearchTerm, "Customer");
    const navigate = useNavigate();

    // Debounce logic using useEffect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm); // Update debounced value after delay
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!results.length) return;

        switch (e.key) {
            case "ArrowDown": // Move down
                setActiveIndex((prevIndex) => Math.min(prevIndex + 1, results.length - 1));
                e.preventDefault(); // Prevent default scrolling
                break;

            case "ArrowUp": // Move up
                setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
                e.preventDefault();
                break;

            case "Tab": // Navigate results with Tab
                setActiveIndex((prevIndex) => (prevIndex + 1) % results.length);
                e.preventDefault();
                break;

            case "Enter": // Select the current result
                if (activeIndex >= 0) {
                    navigate(`/profile/${results[activeIndex].id}`);
                } else if (results.length > 0) {
                    navigate(`/profile/${results[0].id}`); // Navigate to the first result
                }
                break;

            default:
                break;
        }
    };

    const handleResultClick = (customerID: string) => {
        navigate(`/profile/${customerID}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setActiveIndex(-1); // Reset active index on new search
    };

    return (
        <div onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: "none" }}>
            <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete='off'
                autoFocus
                id="search-input"
                name="cust-search"
                spellCheck="false"
                placeholder='Customer Search'
                aria-label="Search input"
            />
            {/* {loading && <p className='loader' />} */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div id="search-results">
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <div
                            key={item.id}
                            className='result'
                            id={index === activeIndex ? "active-result" : ""}
                            onClick={() => handleResultClick(item.id)}>
                            {item.first_name} {item.last_name}&nbsp;&nbsp;&nbsp;{item.phone}
                        </div>
                    ))
                ) : (
                    <div className='message-screen'>nothing to show here</div>
                )}
            </div>
        </div>
    );
};

//Profile Page
export const ProfilePage: React.FC = () => {
    const { customerID } = useParams<{ customerID: string }>(); // Extract customerID from URL

    const navigate = useNavigate(); // Use the navigate hook

    useEffect(() => {
        // Define a function that will handle the Escape key press
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                navigate(-1); // Go back to the previous page
            }
        };

        // Add event listener for keydown event
        window.addEventListener("keydown", handleEscape);

        // Cleanup event listener when component unmounts
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [navigate]); // Include navigate in the dependency array

    if (!customerID) {
        return <div>Error: Customer ID not found!</div>;
    }

    return (
        <>
            <CurrentProfile customerID={customerID} />
            <CustomerCards customerID={customerID} />
        </>
    );
};

//Home Page
export const Home = () => {
    return (
        <>
            <div id="live-view"> {/* viewport of all "due cards" */}
                <SearchnResults />
                <div id="filter-due">{lorem}</div>
                <div id="due-view">
                    <div>{lorem}</div>
                    <div>bambam</div>
                    <div>{lorem}</div>
                </div>
            </div>
        </>
    );
};

//Manage Brands Page
export const Brands = () => {
    return (
        <>
            <h1>Registered Brands</h1>
            <BrandCards />
        </>
    );
};

//Database Page
export const Database = () => {
    return (
        <>
            <h1>Database</h1>
        </>
    );
};

export const Builder = () => (
    <div>
    </div>
);
