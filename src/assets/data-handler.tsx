import { database } from "./client.ts";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export const fetch = async function (
    tableName: string,
    setData: (data: any) => void,
    setLoading?: (data: boolean) => void,
    columns = '*',
    filters?:(query: PostgrestFilterBuilder<any, any, any, any, any>) => PostgrestFilterBuilder<any, any, any, any, any>,
    limit?: number
) {
    if (setLoading) setLoading(true);
    let query = database.from(tableName).select(columns)as unknown as PostgrestFilterBuilder<any, any, any, any, any>;
    if (filters) { query = filters(query)}
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
    setData: (data: any) => void,
    setLoading?: (data: any) => void,
    columns = '*',
    filters?: (query: ReturnType<typeof database['from']>['select']) => ReturnType<typeof database['from']>['select'],
    limit?: number) {
    await database
        .from(tableName)
        .insert({ /*insert all form parameters here*/ })
}
