import React, { useEffect, useState } from 'react';
import { database } from "./client.ts";

interface TableProps {
  tableName: string;
}

interface ProfileProps {
  customerID: string;
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await database.from('Customer').select('*').eq('id', customerID)
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, ['Customer']);

  if (loading) return <p className='loader' />;

  return (
    <>
      {data.map((customer) => (
        <table id='Profile'>
          <thead>
            <tr>
              <th>Name:</th>
              <th>{customer.first_name + ' ' + customer.last_name}</th>
            </tr>
            <tr>
              <th>Phone:</th>
              {customer.phone.length < 11 ?
                <th>{customer.phone.slice(0, 3) + ' ' + customer.phone.slice(3, 6) + ' ' + customer.phone.slice(6)}</th> :
                <th>{customer.phone.slice(0, 3) + ' ' + customer.phone.slice(3, 7) + ' ' + customer.phone.slice(7)}</th>}
            </tr>
          </thead>
        </table>
      ))}
    </>
  );
};