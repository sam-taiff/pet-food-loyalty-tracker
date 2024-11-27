import '../master.css';
import logo from './sparrow.png';
import { createRow } from './data-handler.tsx';
import { useNavigate, useParams, Outlet, useHref, useLocation } from 'react-router-dom';
import { BrandCards, CurrentProfile, CustomerCards, useSupabaseSearch, SimpleSearchBar, TableComponent, ShowMostRecent } from './view-components.tsx';
import React, { useEffect, useState, useRef } from 'react';
import Modal from "react-modal";

Modal.setAppElement("#root");

//placeholder text (DEV USE ONLY)
const lorem: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lectus dui, rutrum sit amet nibh et, consectetur consequat metus. Nunc ultricies enim nec suscipit mollis. Praesent hendrerit, neque nec porta semper, sem tellus venenatis mi, vel sollicitudin tortor elit in libero. Etiam vitae enim eu velit aliquam fringilla. Mauris eleifend ante nisi, sit amet imperdiet purus sodales vitae. Ut posuere rhoncus quam nec dapibus. Proin ullamcorper mauris et lorem dignissim vehicula vitae mattis orci. In eu pulvinar ex. Curabitur euismod tellus quis enim condimentum vehicula. Fusce ac placerat nisi, in ultrices elit. Nulla fringilla ultrices eros, ut dictum felis luctus in. Donec pulvinar tempor felis, sit amet dignissim metus. Maecenas lectus erat, tempor vitae turpis vel, vulputate ultrices nisi."

export const TopBar = ({ routes }: { routes: { path: string; title: string }[] }) => {
    const location = useLocation();

    const currentRoute = routes.find((route) => route.path === location.pathname);
    const headerText = currentRoute ? currentRoute.title : '';

    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

    const openModal = () => {
        setIsModalOpen(true); // Open the modal when "New Purchase" is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div id='topbar'>
            <div>
                <img src={logo} id="logo" />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a id="site-name" title="Back to Homepage" href='/'><span>{document.title}</span></a>
            </div>
            <span id="page-name">{headerText}</span>
            <a id="new-purchase-button" onClick={openModal}>New Purchase</a>
            {isModalOpen && <AddPurchaseButton onAdd={(newPurchase) => createRow("Purchase", newPurchase)} onClose={closeModal} />}
        </div>
    )
}

export const SideBar = () => {
    return (
        <div id="sidenav">
            <a title="Loyalty Card Tracking Home" href="/">Home</a>
            <a title="View Database" href="/database">Recent</a>
            <a title="Brands Page" href="/brands">All Brands</a>
            <a href="/builder">Builder</a>
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
    const searchRef = useRef<HTMLInputElement>(null);

    // Debounce logic using useEffect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm); // Update debounced value after delay
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Handle keyboard navigation and reset on Esc key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            // Reset the search term and active index
            setSearchTerm("");
            setActiveIndex(-1); // Reset active index
            if (searchRef.current) searchRef.current.focus(); // Refocus the search input
            e.preventDefault(); // Prevent default action for ESC
        }

        if (!results.length) return; // Don't handle navigation if no results

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
        <div onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: "none", maxWidth: "620px", width: "75%" }}>
            <input
                ref={searchRef}
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
                autoFocus
                id="search-input"
                name="cust-search"
                spellCheck="false"
                placeholder="Customer Search"
                aria-label="Search input"
            />
            {loading && <p className="loader" />}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div id="search-results">
                {!loading && searchTerm && results.length === 0 ? (
                    <div className="message-screen">
                        This person has yet to start a loyalty card<br />
                        Press <code>enter</code> to create a new customer profile
                    </div>
                ) : (
                    results.map((item, index) => (
                        <div
                            key={item.id}
                            className="result"
                            id={index === activeIndex ? "active-result" : ""}
                            onClick={() => handleResultClick(item.id)}
                        >
                            <div className="name">{item.first_name} {item.last_name}</div>
                            <div className="phone">{item.phone}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


//Profile Page
export const ProfilePage = () => {
    const { customerID } = useParams<{ customerID: string }>(); // Extract customerID from URL
    console.log("Params:", useParams());
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
            <table id="tab-view">
                <thead>
                    <tr id="tabs">
                        <a href={useHref('card')}>Card View</a>
                        <a href={useHref('list')}>List View</a>
                    </tr>
                </thead>
                <tbody>
                    <tr id="tab-pages">
                        <td colSpan={2}>
                            <Outlet />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

//Home Page
export const Home = () => {
    return (
        <>
            <SearchnResults />
            <div id="filter-due">{lorem}</div>
            <div id="due-view">
                <div>{lorem}</div>
                <div>bambam</div>
                <div>{lorem}</div>
            </div>
        </>
    );
};

//Manage Brands Page
export const Brands = () => {
    return (
        <div style={{ display: "block" }}>
            <BrandCards />
        </div>
    );
};

//Database Page
export const Database = () => {
    return (
        <div>
            <span>showing up to 100 entries</span>
            <ShowMostRecent />
        </div>
    );
};

interface TableData { [key: string]: any; }

export const Builder = () => {
    const { customerID } = useParams();
    const [data, setData] = useState<TableData[]>([]);

    const handleAddPurchase = (newPurchase: { [key: string]: string }) => {
        setData((prevData) => [...prevData, { ...newPurchase, customer_id: customerID }]);
        // Optionally send the new entry to your backend here
        console.log("New Purchase Added:", newPurchase);
    };

    const closeModal = () => {
        console.log("closed-form"); // Close the modal
    };
    return (
        <div style={{ width: "90%" }}>
            <NewBrandForm />
            <div className="loader"></div>
            <NewCustomerForm />
            <AddPurchaseButton onAdd={(newPurchase) => createRow("Purchase", newPurchase)} onClose={closeModal} />
        </div>
    );
};

export const NewCustomerForm: React.FC = () => {
    /* create a
                                        const [data, setData] = useState<string>("")
                                            for every field of the form */

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        /* assign a {const newRow} where the name of each field is the
                                                            same as the one corresponding to the supabase */
        const newRow = {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
        };

        /* check to see if the row was inserted correctly */
        const insertedRow = await createRow('Customer', newRow);

        if (insertedRow) {
            console.log('Row created successfully:', insertedRow);
        } else {
            console.error('Failed to create row');
        }

        /* reset fields to empty */
        setFirstName(""); setLastName(""); setPhone("");
    };

    return (
        <div>
            <h2>Create New Customer</h2>
            <form id="new-customer" onSubmit={handleSubmit}>
                <table id="create-new-customer">
                    <tbody>
                        <tr>
                            <th>
                                <label htmlFor="first_name">First Name:</label>
                            </th>
                            <td>
                                <input
                                    id="first_name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="last_name">Last Name:</label>
                            </th>
                            <td>
                                <input
                                    id="last_name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="phone">Phone:</label>
                            </th>
                            <td>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="submit" type="submit" >Create New Profile</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export const NewBrandForm: React.FC = () => {
    /* create a
                                                            const [data, setData] = useState<string>("")
                                                                for every field of the form */

    const [brandName, setBrandName] = useState<string>("");
    const [purchasesNeeded, setPurchasesNeeded] = useState<string>("");
    const [reward, setReward] = useState<string>("");
    const [monthsValid, setMonthsValid] = useState<string>("");
    const [validSizes, setValidSizes] = useState<string>("");
    const [tcs, setTCS] = useState<string>("");
    const [logo, setLogo] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        /* assign a {const newRow} where the name of each field is the
                                                                                                same as the one corresponding to the supabase */
        const newRow = {
            name: brandName,
            purchases_needed: purchasesNeeded,
            reward: reward,
            months_valid: monthsValid,
            valid_sizes: validSizes,
            tcs: tcs,
            logo: logo
        };

        /* check to see if the row was inserted correctly */
        const insertedRow = await createRow('Brand', newRow);

        if (insertedRow) {
            console.log('Row created successfully:', insertedRow);
        } else {
            console.error('Failed to create row');
        }

        /* reset fields to empty */
        setBrandName(""); setPurchasesNeeded(""); setReward("");
        setMonthsValid(""); setValidSizes(""); setTCS(""); setLogo("");
    };

    return (
        <div>
            <h2>Create New Customer</h2>
            <form id="create-new" onSubmit={handleSubmit}>
                <table id="create-new-brand">
                    <tbody>
                        <tr>
                            <th>
                                <label htmlFor="brand_name">Brand Name:</label>
                            </th>
                            <td>
                                <input
                                    id="brand_name"
                                    type="text"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="purchases_needed"># Purchases Needed:</label>
                            </th>
                            <td>
                                <input
                                    id="purchases_needed"
                                    type="text"
                                    value={purchasesNeeded}
                                    onChange={(e) => setPurchasesNeeded(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="reward">Reward:</label>
                            </th>
                            <td>
                                <input
                                    id="reward"
                                    type="text"
                                    value={reward}
                                    onChange={(e) => setReward(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="months_valid">Months Valid:</label>
                            </th>
                            <td>
                                <input
                                    id="months_valid"
                                    type="text"
                                    value={monthsValid}
                                    onChange={(e) => setMonthsValid(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="valid_sizes">Valid Sizes:</label>
                            </th>
                            <td>
                                <input
                                    id="valid_sizes"
                                    type="text"
                                    value={validSizes}
                                    onChange={(e) => setValidSizes(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="tcs">T&C's:</label>
                            </th>
                            <td>
                                <input
                                    id="tcs"
                                    type="text"
                                    value={tcs}
                                    onChange={(e) => setTCS(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="brand-logo">Upload Logo:</label>
                            </th>
                            <td>
                                <input
                                    id="brand-logo"
                                    type="text"
                                    value={logo}
                                    onChange={(e) => setLogo(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button className="submit" type="submit" >Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}


export const SuccessScreen = () => {
    return (
        <div>

        </div>
    );
}

// const FormCustSearch = () => {
//     const [searchTerm, setSearchTerm] = useState<string>(""); // Actual input value
//     const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(""); // Debounced value
//     const [activeIndex, setActiveIndex] = useState<number>(-1); // Track the active result index
//     const { results, loading, error } = useSupabaseSearch(debouncedSearchTerm, "Customer");
//     const navigate = useNavigate();
//     const searchRef = useRef<HTMLInputElement>(null);

//     // Debounce logic using useEffect
//     useEffect(() => {
//         const handler = setTimeout(() => {
//             setDebouncedSearchTerm(searchTerm); // Update debounced value after delay
//         }, 300);

//         return () => {
//             clearTimeout(handler);
//         };
//     }, [searchTerm]);

//     // Handle keyboard navigation and reset on Esc key press
//     const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//         if (e.key === "Escape") {
//             // Reset the search term and active index
//             setSearchTerm("");
//             setActiveIndex(-1); // Reset active index
//             if (searchRef.current) searchRef.current.focus(); // Refocus the search input
//             e.preventDefault(); // Prevent default action for ESC
//         }

//         if (!results.length) return; // Don't handle navigation if no results

//         switch (e.key) {
//             case "ArrowDown": // Move down
//                 setActiveIndex((prevIndex) => Math.min(prevIndex + 1, results.length - 1));
//                 e.preventDefault(); // Prevent default scrolling
//                 break;

//             case "ArrowUp": // Move up
//                 setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//                 e.preventDefault();
//                 break;

//             case "Tab": // Navigate results with Tab
//                 setActiveIndex((prevIndex) => (prevIndex + 1) % results.length);
//                 e.preventDefault();
//                 break;

//             case "Enter": // Select the current result
//                 if (activeIndex >= 0) {
//                     navigate(`/profile/${results[activeIndex].id}`);
//                 } else if (results.length > 0) {
//                     navigate(`/profile/${results[0].id}`); // Navigate to the first result
//                 }
//                 break;

//             default:
//                 break;
//         }
//     };

//     const handleResultClick = (customerID: string) => {
//         navigate(`/profile/${customerID}`);
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         setSearchTerm(e.target.value);
//         setActiveIndex(-1); // Reset active index on new search
//     };

//     return (
//         <div onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: "none", maxWidth: "620px", width: "75%" }}>
//             <SimpleSearchBar results={results.map((item, index) => (
//                         item.first_name+item.last_name+'|'+item.phone
//                     ))} />;
//         </div>
//     );
// }

export function AddPurchaseButton({ onAdd, onClose }: { onAdd: (newPurchase: { [key: string]: string }) => void, onClose: () => void }) {
    const getTodayInNZST = (): string => {
        const now = new Date();
        const nzstDate = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Pacific/Auckland",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .format(now)
            .split("/")
            .reverse()
            .join("-"); // Convert DD/MM/YYYY to YYYY-MM-DD
        return nzstDate;
    };

    const [formData, setFormData] = useState({
        brand_id: "",
        date: getTodayInNZST(),
        size: "",
        species: "",
        staff: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData); // Send new purchase data to the parent
        setFormData({ brand_id: "", date: getTodayInNZST(), size: "", species: "", staff: "" }); // Reset form
        onClose(); // Close modal after submission
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h1>New Purchase</h1>
                    <form onSubmit={handleSubmit}>
                        {/* <FormCustSearch /> */}
                        <select
                            // multiple size={1}
                            name="brand_id"
                            value={formData.brand_id}
                            onChange={handleChange}
                            required>
                            <option selected>Select brand</option>
                            <option>Cherry</option>
                            <option>Lemon</option>
                        </select>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="size"
                            placeholder="Bag size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="species"
                            placeholder="Species"
                            value={formData.species}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="staff"
                            placeholder="Staff init."
                            value={formData.staff}
                            onChange={handleChange}
                            required
                        />
                        <div className="modal-actions">
                            <button type="submit">Submit</button>
                            <button type="button" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}