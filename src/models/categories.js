import db from './db.js';

async function getAllCategories() {
    try {
        const sql = 'SELECT * FROM categories ORDER BY name ASC';
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories: ", error);
        throw error;
    }
}

const getCategoryById = async (id) => {
    const query = `
    SELECT category_id, name
    FROM categories
    WHERE category_id = $1;
  `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name;
  `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
    SELECT p.project_id, p.title, p.description,
           p.date, p.location, p.organization_id,
           o.name AS organization_name
    FROM project p
    JOIN project_categories pc ON p.project_id = pc.project_id
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.date;
  `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId };