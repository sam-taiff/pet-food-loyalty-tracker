import React, { useEffect, useState, useMemo, useCallback, ChangeEventHandler, ChangeEvent } from 'react';
import { database } from './client.ts';
import { fetch, getCustomerPurchase, getRECENT } from './data-handler.tsx';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { useParams } from 'react-router-dom';

interface TableProps {
  tableName: string;
  columns?: string;
  filters?: (query: PostgrestFilterBuilder<any, any, any, any, any>) => PostgrestFilterBuilder<any, any, any, any, any>
  limit?: number;
}

interface ProfileProps { customerID: string; }

interface TableData { [key: string]: any; }

export const TableComponent: React.FC<TableProps> = ({ tableName, columns = '*', filters, limit }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(tableName, setData, setLoading, columns, filters, limit) }, [tableName]);

  if (loading) return <p className='loader' />;

  if (!data.length) return <p className='message-screen'>Sorry!<br />There's no data available here for the table called "{tableName}"</p>;

  // Get table headers from the data keys
  const headers = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const MalTableComponent = (data: any[]) => {

  if (!data.length) return <p className='message-screen'>Sorry!<br />There's no data available here</p>;

  // Get table headers from the data keys
  const headers = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const VertTable: React.FC<TableProps> = ({ tableName, columns = '*', filters, limit }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(tableName, setData, setLoading, columns, filters, limit) }, [tableName]);

  if (loading) return <p className='loader' />;

  if (!data.length) return <p className='message-screen'>Sorry!<br />There's no data available here for the table called "{tableName}"</p>;

  // Get table headers from the data keys
  const headers = Object.keys(data[0]);
  return (
    <table>
      <tbody>
        {headers.map((header) => (
          <tr key={header}>
            <th>{header}</th>
            {data.map((row, index) => (
              <td key={index}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export const CurrentProfile: React.FC<ProfileProps> = ({ customerID }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');

  useEffect(() => {
    fetch("Customer", setData, setLoading, "*", (query) => query.eq('id', customerID));
  }, ["Customer"]);

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditedValue(value);
  };

  const handleSave = async (customerId: string, field: string) => {
    // Update the database
    await updateCustomer(customerId, { [field]: editedValue });

    // Update local data
    setData((prevData) =>
      prevData.map((customer) =>
        customer.id === customerId ? { ...customer, [field]: editedValue } : customer
      )
    );

    setEditingField(null);
  };

  const updateCustomer = async (id: string, updates: { [key: string]: string }) => {
    const { error } = await database
      .from("Customer")
      .update(updates)
      .eq("id", id);
    if (error) console.error("Error updating customer:", error);
  };

  const handleKeyDown = (e: React.KeyboardEvent, customerId: string, field: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave(customerId, field);
    }
  };

  if (loading) return <p className='loader' />;

  return (
    <>
      {data.map((customer) => (
        <div id="profile" key={customer.id}>
          <div className="name">
            {editingField === `first_name-${customer.id}` ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onBlur={() => handleSave(customer.id, "first_name")}
                onKeyDown={(e) => handleKeyDown(e, customer.id, "first_name")}
                size={editedValue.length || customer.first_name.length} // Adjust input size
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => handleEdit(`first_name-${customer.id}`, customer.first_name)}>
                {customer.first_name}
              </span>
            )}
            {" "}
            {editingField === `last_name-${customer.id}` ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onBlur={() => handleSave(customer.id, "last_name")}
                onKeyDown={(e) => handleKeyDown(e, customer.id, "last_name")}
                size={editedValue.length || customer.last_name.length} // Adjust input size
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => handleEdit(`last_name-${customer.id}`, customer.last_name)}>
                {customer.last_name}
              </span>
            )}
          </div>
          <div className="phone">
            {editingField === `phone-${customer.id}` ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onBlur={() => handleSave(customer.id, "phone")}
                onKeyDown={(e) => handleKeyDown(e, customer.id, "phone")}
                size={editedValue.length || customer.phone.length} // Adjust input size
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => handleEdit(`phone-${customer.id}`, customer.phone)}>
                {customer.phone.length < 11
                  ? customer.phone.slice(0, 3) + ' ' + customer.phone.slice(3, 6) + ' ' + customer.phone.slice(6)
                  : customer.phone.slice(0, 3) + ' ' + customer.phone.slice(3, 7) + ' ' + customer.phone.slice(7)}
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

function formatTableData(data: Array<{ [key: string]: any }>, withSpaces?: boolean): Array<{ [key: string]: any }> {
  if (!data) return [];
  const spaces = withSpaces ? " " : "";
  return data.map((item) => ({
    ...item,
    date: item.date
      ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).format(new Date(item.date)).replace(/\s+/g, spaces)
      : null,
  }));
};

export const CustomerCards: React.FC = () => {
  const [data, setData] = useState<any[]>();
  const [groupedData, setGroupedData] = useState<{ [key: string]: TableData[] }>({});
  const [loading, setLoading] = useState(true);

  const { customerID } = useParams<{ customerID: string }>();
  console.log("this is the current customerID : ", customerID);

  useEffect(() => {
    const getCustomerData = async () => {
      setLoading(true);
      await getCustomerPurchase(customerID, setData);
      setLoading(false);
    };

    if (customerID) getCustomerData();
  }, [customerID]);

  useEffect(() => {
    if (data) {
      // Group data by brand_id and species
      const grouped = data.reduce((acc, item) => {
        const groupKey = `${item.brand_id || 'Unspecified'}|${item.species || 'Unspecified'}`;
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {} as { [key: string]: TableData[] });

      setGroupedData(grouped);
    }
  }, [data]);

  if (loading) return <p className='loader' />;

  return (
    <div id='purchase-groups'>
      {Object.entries(groupedData).map(([groupKey, purchases]) => (
        <div key={groupKey} className="purchase-group">
          <span id='card-title'>
            <span className="brand">{groupKey.split('|')[0]}</span>
            <span className="species">{groupKey.split('|')[1]}</span>
          </span>
          <div id='purchase-stamps'>
            {purchases.map((purchase, index) => (
              <div key={index} className="purchase-stamp">
                {purchase.date ? <span>{purchase.date}</span> : 'no date'}<br />
                {purchase.bag || 'no size'}<br />
                {purchase.staff || 'no staff init.'}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// const displayCustData = () => {
//   const { customerID } = useParams<{ customerID: string}>();
//   const [custData, setCustData] = useState<any[]>([]);
//   // const [detData, setDetData] = useState<any[]>([]);

//   // useEffect(() => {
//   //   if (!customerID) return;
//   //   fetch("Purchase", (fetchedData) => {
//   //     const sortedData = fetchedData.sort(
//   //       (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   //     );
//   //     setData(sortedData);
//   //   }, undefined, "bag_id, date, staff", (query) => query.eq("customer_id", customerID));
//   // }, [customerID]);

//   // const formattedData = formatTableData(data, true);

//   // useEffect(() => {
//   //   if (formattedData.length === 0) return; // Prevent unnecessary fetch calls
//   //   fetch(
//   //     "Bag",
//   //     setDetData,
//   //     undefined,
//   //     "brand, species, product, size",
//   //     (query) => query.in("id", formattedData.map((item) => item.bag_id))
//   //   );
//   // }, [formattedData]);

//   // useEffect(() => {
//   //   if (detData.length > 0) {
//   //     console.log("This is supposed to be bag data:", detData);
//   //   }
//   // }, [detData]);

//   // return (
//   //   <>hello</>
//   // );
//   if (!customerID) return;

//   useEffect(() => {
//     getCustomerPurchase(customerID, setCustData)
//   }, ["Customer"])

//   return (
//     <MalTableComponent data={custData}/>
//   );
// };

export function CustListView() {
  const { customerID } = useParams();
  const [data, setData] = useState<any[]>([]);
  // const [filteredData, setFilteredData] = useState<any[]>([]);
  // const [filters, setFilters] = useState<{ [key: string]: string }>({});
  // const [loading, setLoading] = useState(true);

  //   const custData = getCustData(customerID);
  // //   useEffect(() => {
  // //   if (custData) {
  // //     console.log("This is supposed to be bag data:", custData);
  // //   }
  // // }, [custData]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       await fetch
  //         ("Purchase", (fetchedData) => {
  //           const sortedData = fetchedData.sort(
  //             (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  //           );
  //           setData(sortedData);
  //           setLoading(false);
  //         }, setLoading, "brand_id,date,size,species,staff", (query) => query.eq("customer_id", customerID));
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   if (customerID) fetchData();
  // }, [customerID]);

  // const formattedData = formatTableData(data, true);

  useEffect(() => {
    getCustomerPurchase(customerID, setData)
  }, [customerID])

  // useEffect(() => {
  //   const applyFilters = () => {
  //     const filtered = data.filter((row) =>
  //       Object.keys(filters).every((key) =>
  //         filters[key] === "" ? true : row[key] === filters[key]
  //       )
  //     );
  //     setFilteredData(filtered);
  //   };

  //   applyFilters();
  // }, [filters, data]);

  // const getUniqueValues = useCallback(
  //   (key: string) => {
  //     return [...new Set(data.map((item) => item[key]))];
  //   },
  //   [data]
  // );

  // const handleFilterChange = (key: string, value: string) => {
  //   setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  // };

  // if (loading) return <p className="loader" />;

  if (data[0] === undefined) {
    console.log("data is undefined");
  }
  const [headers, setHeaders] = useState<string[]>([]);
  useEffect(() => {
      setHeaders(Object.keys(data[0]));
  }, []);
  // const headers = Object.keys(data);
  console.log("headers : ", headers);

  return (
    <table id="list-view">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}
              {/* <div>
                <select
                  value={filters[header] || ""}
                  onChange={(e) => handleFilterChange(header, e.target.value)}
                >
                  <option value="">
                    All {header.charAt(0).toUpperCase() + header.slice(1)}
                  </option>
                  {getUniqueValues(header).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div> */}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header}>{row[header] as string | number}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const customerSearch = (searchTerm: string) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    fetch(
      "Customer",
      setResults,
      setLoading,
      '*',
      (query) => (
        query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      )
    )

  }, [searchTerm]);

  return { results, loading };
};

export const ShowMostRecent = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const [recentData, setRecentData] = useState<any[]>([]);
  useEffect(() => {
    getRECENT(setRecentData);
    setLoading(false);
  }, []);

  const recentHeaders = recentData.length > 0 ? Object.keys(recentData[0]) : [];
  console.log("recentData length : ", recentData.length);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, column: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: e.target.value,
    }));
  };

  const getUniqueValuesForColumn = (column: string) => {
    // Get unique values and sort them
    const uniqueValues = Array.from(new Set(recentData.map((row) => row[column]?.toString()))).sort();
    return uniqueValues;
  };

  const filteredData = recentData.filter((row) => {
    return Object.keys(filters).every((column) => {
      const filterValue = filters[column]?.toLowerCase() || '';
      const rowValue = (row[column]?.toString() || '').toLowerCase();
      if (!filterValue) return true; // If no filter, return all rows
      return rowValue.includes(filterValue);
    });
  });

  if (loading) return <p className='loader' />;

  if (!recentData.length) return <p className='message-screen'>Sorry!<br />There's no data available here</p>;

  return (
    <table id="most-recent">
      <thead>
        <tr>
          {recentHeaders.map((header) => (
            <th key={header}>
              {/* {header.replace(/_/g, ' ')} */}
              <select
                value={filters[header] || ''}
                onChange={(e) => handleFilterChange(e, header)}
              >
                <option value="">{header.replace(/_/g, ' ')}</option>
                {getUniqueValuesForColumn(header).map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((row, index) => (
          <tr key={index}>
            {recentHeaders.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};