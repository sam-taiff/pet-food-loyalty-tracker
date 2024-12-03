import { database } from "./client.ts";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export const fetch = async function (
    tableName: string,
    setData: (data: any) => void,
    setLoading?: (data: boolean) => void,
    columns = '*',
    filters?: (query: PostgrestFilterBuilder<any, any, any, any, any>) => PostgrestFilterBuilder<any, any, any, any, any>,
    limit?: number
) {
    if (setLoading) setLoading(true);

    let query = database.from(tableName).select(columns) as unknown as PostgrestFilterBuilder<any, any, any, any, any>;

    if (filters) { query = filters(query) }
    if (limit) { query = query.limit(limit) }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        setData(data || []);
    }
    if (setLoading) setLoading(false);
}

export const deleteRow = async function (table: string, idColumn: string, idToDelete: string, setData: (data: any) => void) {
    await database
        .from(table)
        .delete()
        .eq(idColumn, idToDelete)
    fetch(table, setData)
}

export const createRow = async function (
    tableName: string,
    data: any,
    setLoading?: (data: boolean) => void,
) {
    if (setLoading) setLoading(true);

    const { data: insertedData, error } = await database
        .from(tableName)
        .insert(data)
        .select();
    if (error) {
        console.error('Error creating row:', error);
        return null;
    }

    return insertedData?.[0] || null;
}

export const getRECENT = async (setData: (data: any[]) => void) => {
    const { data, error } = await database.rpc('getRECENT');
    if (error) {
        console.error('Error getting most recent purchases:', error);
        setData([]);
    } else {
        console.log('Fetched data:', data);
        // setData(data || []);
        setData(Array.isArray(data) ? data : [data]);
    }
}

export const getCustomerPurchase = async (customerid: string | undefined, setData: (data: any[]) => void) => {
    if (!customerid) {
        console.log("there is no customerID here!");
        return;
    }
    const { data, error } = await database.rpc('get_customer_purchases', {
        customerid: customerid
    });
    if (error) {
        console.log("customerID from within datahandler is : ", customerid);
        console.error('Error getting customer purchases:', error);
        setData([]);
    } else {
        // setData(data || []);
        setData(Array.isArray(data) ? data : [data]);
        console.log('Fetched data:', data);
    }
}