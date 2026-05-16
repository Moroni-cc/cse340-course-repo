import db from './db.js';

export async function getAllProjects() {
    try {
        const sql = `
            SELECT p.*, o.name AS organization_name
            FROM projects p
            JOIN organization o ON p.organization_id = o.organization_id
            ORDER BY p.date ASC`;

        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects: ", error);
        throw error;
    }
}