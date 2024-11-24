import React, { useEffect, useState } from 'react';
import { database } from './client.ts';
import { fetch } from './data-handler.tsx';
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

export const BrandCards = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("Brand", setData, setLoading) }, ["Brand"]);

  if (loading) return <p className='loader' />;
  return (
    <table>
      {data.map((brand) => (
        <tr>
          <td>
            <img className="brand-logo" src={brand.logo} />
          </td>
          <td>
            Buy {brand.purchases_needed}, get a {brand.reward}<br />
            {brand.months_valid && <p>Valid {brand.months_valid}</p>}
            {brand.tcs && <p>*{brand.tcs}.</p>}
          </td>
        </tr>))}
    </table>
  );
};

export const CurrentProfile: React.FC<ProfileProps> = ({ customerID }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("Customer", setData, setLoading, "*", (query) => query.eq('id', customerID)) }, ["Customer"]);

  if (loading) return <p className='loader' />;

  return (
    <>
      {data.map((customer) => (
        <div id='profile'>
          <div className="name">{customer.first_name + ' ' + customer.last_name}</div>
          <div className="phone">
            {customer.phone.length < 11
              ? customer.phone.slice(0, 3) + ' ' + customer.phone.slice(3, 6) + ' ' + customer.phone.slice(6)
              : customer.phone.slice(0, 3) + ' ' + customer.phone.slice(3, 7) + ' ' + customer.phone.slice(7)}
          </div>
        </div>
      ))}
    </>
  );
};

function formatTableData(data: Array<{ [key: string]: any }>): Array<{ [key: string]: any }> {
  if (!data) return [];

  return data.map((item) => ({
    ...item,
    date: item.date
      ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).format(new Date(item.date)).replace(/\s+/g, '')
      : null,
  }));
}

export const CustomerCards: React.FC = () => {
  const [groupedData, setGroupedData] = useState<{ [key: string]: TableData[] }>({});
  const [loading, setLoading] = useState(true);

  const { customerID } = useParams<{ customerID: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await database
        .from('Purchase')
        .select('date, size, salesperson, brand_id, species')
        .eq('customer_id', customerID);

      if (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        return;
      }

      // Format the date field
      const formattedData = formatTableData(data);

      // Group data by brand_id and species
      const grouped = formattedData.reduce((acc, item) => {
        const groupKey = `${item.brand_id || 'Unspecified'}|${item.species || 'Unspecified'}`;
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {} as { [key: string]: TableData[] });

      setGroupedData(grouped);
      setLoading(false);
    };

    fetchData();
  }, [customerID]);

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
                {purchase.date ? <span>{purchase.date}</span> : 'missing date'}<br />
                {purchase.size || 'missing size'}<br />
                {purchase.salesperson || 'missing staff init.'}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export function CustListView() {
  const { customerID } = useParams();
  const [data, setData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("Purchase", setData, setLoading, "brand_id,date,size,species,salesperson", (query) => query.eq('customer_id', customerID)) }, ["Purchase"]);

  const formattedData = formatTableData(data);

  useEffect(() => { setFilteredData(formattedData); }, [formattedData]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const filtered = formattedData.filter((row) =>
      Object.keys(newFilters).every((filterKey) =>
        newFilters[filterKey] === "" ? true : row[filterKey] === newFilters[filterKey]
      )
    );
    setFilteredData(filtered);
  };

  const getUniqueValues = (key: string): string[] => {
    return [...new Set(formattedData.map((item) => item[key]))];
  };

  if (loading) return <p className='loader' />;

  const headers = Object.keys(formattedData[0]);

  return (
    <table id="list-view">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              <div>
                <select
                  value={filters[header] || ""}
                  onChange={(e) => handleFilterChange(header, e.target.value)}
                >
                  <option value="">All {header.charAt(0).toUpperCase() + header.slice(1)}</option>
                  {getUniqueValues(header).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const useSupabaseSearch = (searchTerm: string, tableName: string) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await database
          .from(tableName)
          .select("*")
          .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);

        if (error) throw error;
        setResults(data || []);
      } catch (err: unknown) {
        console.error("Query Error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [searchTerm, tableName]);

  return { results, loading, error };
};