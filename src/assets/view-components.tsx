import React, { useEffect, useState } from 'react';
import { database } from "./client.ts";

// Define types for our data
interface TableProps {
  tableName: string;
}

interface TableData {
  [key: string]: any;
}

export const TableComponent: React.FC<TableProps> = ({ tableName }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await database.from(tableName).select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [tableName]);

  if (loading) return <p className='message-screen'>Loading...</p>;

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

export const VertTable: React.FC<TableProps> = ({ tableName }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await database.from(tableName).select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [tableName]);

  if (loading) return <p className='loader' />;

  if (!data.length) return <p className='message-screen'>Sorry!<br />There's no data available here for the table called "{tableName}"</p>;

  // Get table headers from the data keys
  const headers = Object.keys(data[0]);
  return (
    <table>
      {headers.map((header) => (
        <tr key={header}>
          <th>{header}</th>
          {data.map((row, index) => (
            <td key={index}>{row[header]}</td>
          ))}
        </tr>
      ))}
    </table>
  );
};

export const BrandCards = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await database.from("Brand").select('*');

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, ["Brand"]);

  if (loading) return <p className='loader' />;
  return (
    <table>
      {data.map((brand) => (
        <tr>
          <td id="card">
            <img className="brand-logo" src={brand.logo} />
          </td>
          <td>
            Buy {brand.purchases_needed}, get a {brand.reward}<br />
            Valid up to {brand.months_valid} before earliest purchase<br />
            *{brand.tcs}.
          </td>
        </tr>))}
    </table>
  );
};