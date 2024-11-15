import '../master.css';
import './brandSVG.tsx';
import logo from './sparrow.png';
import { Route, Routes } from 'react-router-dom';
import TableComponent from './table-component.tsx';

//placeholder text (DEV USE ONLY)
const lorem: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin lectus dui, rutrum sit amet nibh et, consectetur consequat metus. Nunc ultricies enim nec suscipit mollis. Praesent hendrerit, neque nec porta semper, sem tellus venenatis mi, vel sollicitudin tortor elit in libero. Etiam vitae enim eu velit aliquam fringilla. Mauris eleifend ante nisi, sit amet imperdiet purus sodales vitae. Ut posuere rhoncus quam nec dapibus. Proin ullamcorper mauris et lorem dignissim vehicula vitae mattis orci. In eu pulvinar ex. Curabitur euismod tellus quis enim condimentum vehicula. Fusce ac placerat nisi, in ultrices elit. Nulla fringilla ultrices eros, ut dictum felis luctus in. Donec pulvinar tempor felis, sit amet dignissim metus. Maecenas lectus erat, tempor vitae turpis vel, vulputate ultrices nisi."
//Navigation Bar
export interface PageProps {
    pageName: string;
}

export const TopBar = ({ pageName }: PageProps) => {
    return (
        <div>
            <div className='topbar'>
                <img src={logo} id="logo" />
                <a title="Back to Homepage" href='/'>
                    <span className='topbar item'>Loyalty Card Tracking</span>
                </a>
                <span className='topbar item' id="cust-name">{pageName}</span>
            </div>
            <hr />
        </div>
    )
}

export const SideNavBar = () => {
    return (
        <table >
            <tbody>
                <tr>
                    <td id="sidenav">
                        <a title="Loyalty Card Tracking Home" href="/"><button>Home</button></a>
                        <a title="View Database" href="/database"><button>View Database</button></a>
                        <a title="Brands Page" href="/brands"><button>Manage Brands</button></a>
                        <a><button>New Purchase</button></a>
                        <a href="/profile"><button>Temp: Profile</button></a>
                    </td>
                    <td id="main-area">
                        <Routes>
                            <Route path="/" element={<Homepage pageName="Home"/>} />
                            <Route path="/brands" element={<Brandpage />} />
                            <Route path="/database" element={<Databasepage />} />
                            <Route path="/profile" element={<Profilepage />} />
                        </Routes>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

//Home Page
export const Homepage = ({ pageName }: PageProps) => {
    pageName = "Home2"
    return (
        <div className='page'>
            <search>
                <form>
                    <input
                        autoComplete='off'
                        autoFocus
                        type="search"
                        id="search-input"
                        name="cust-search"
                        spellCheck="false"
                        placeholder='Customer Search'
                    />
                </form>
            </search>
            <div id="due-view"> {/* viewport of all "due cards" */}
                <div id="filter-due">{lorem}</div>
                <div id="due-cards">{lorem}</div>
            </div>
        </div>
    );
};

//Profile Page
export const Profilepage = () => {
    {/*
        const custName = customer.firstName + customer.lastName;


        */}
    return (
        <div>
            <div>

            </div>
        </div>
    );
};

//Manage Brands Page
export const Brandpage = () => {
    return (
        <>
            <h1>Registered Brands</h1>
            <TableComponent tableName="Brand" />
        </>
    );
};

//Database Page
export const Databasepage = () => {
    return (
        <>
            <h1>Database</h1>
        </>
    );
};
