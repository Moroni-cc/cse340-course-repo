import db from './db.js';

export async function getAllCategories() {
    try {
        const sql = 'SELECT * FROM categories ORDER BY name ASC';
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories: ", error);
        throw error;
    }
}