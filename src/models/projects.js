import db from './db.js';

async function getAllProjects() {
  try {
    const sql = `
            SELECT p.*, o.name AS organization_name
            FROM project p
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

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;
  const result = await db.query(query, [number_of_projects]);
  return result.rows;
};

const getProjectDetails = async (id) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
}

const updateProject = async (projectId, title, description, location, date, organizationId) => {
  const query = `
    UPDATE project
    SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const queryParams = [title, description, location, date, organizationId, projectId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', projectId);
  }

  return result.rows[0].project_id;
};

const addProjectVolunteer = async (projectId, userId) => {
  const query = `
    INSERT INTO project_volunteers (project_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (project_id, user_id) DO NOTHING
    RETURNING project_id, user_id;
  `;

  const result = await db.query(query, [projectId, userId]);
  return result.rows[0];
};

const removeProjectVolunteer = async (projectId, userId) => {
  const query = `
    DELETE FROM project_volunteers
    WHERE project_id = $1 AND user_id = $2
    RETURNING project_id, user_id;
  `;

  const result = await db.query(query, [projectId, userId]);
  return result.rows[0];
};

const getVolunteerProjectsByUserId = async (userId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name,
      pv.volunteered_at
    FROM project_volunteers pv
    JOIN project p ON pv.project_id = p.project_id
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.date ASC;
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
};

const isUserVolunteeringForProject = async (projectId, userId) => {
  const query = `
    SELECT project_id, user_id
    FROM project_volunteers
    WHERE project_id = $1 AND user_id = $2;
  `;

  const result = await db.query(query, [projectId, userId]);
  return result.rows.length > 0;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
  addProjectVolunteer,
  removeProjectVolunteer,
  getVolunteerProjectsByUserId,
  isUserVolunteeringForProject
};