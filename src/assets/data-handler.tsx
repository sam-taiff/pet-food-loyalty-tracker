import { database } from "./client.ts";

export const refresh = async function (table: string, callback: (data: any) => void) {
    const { data } = await database
        .from(table)
        .select('*')
    callback(data)
}

export const deleteRow = async function (table: string, idColumn: string, idToDelete: string, callback: (data: any) => void) {
    await database
        .from(table)
        .delete()
        .eq(idColumn, idToDelete)
    refresh(table, callback)
}

export const createRow = async function (table: string) {
    await database
        .from(table)
        .insert({ /*insert all form parameters here*/ })
}
