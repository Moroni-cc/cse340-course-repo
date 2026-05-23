import db from './db.js';

async function getAllProjects() {
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
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      date
    FROM project
    WHERE organization_id = $1
    ORDER BY date;
  `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId };