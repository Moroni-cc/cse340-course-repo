-- ==========================================================
-- Database Setup Script
-- Student: Raúl Moroni Capcha Cadillo
-- ==========================================================

-- 1. CLEANUP
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS organization;

-- 2. CREATE TABLES
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    logo_filename VARCHAR(255)
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project 
        FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category 
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- 3. INSERT SAMPLE DATA

-- Organizations
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure.', 'contact@brightfuture.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability.', 'info@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities.', 'help@unityserve.org', 'unityserve-logo.png');

-- Categories
INSERT INTO categories (name) VALUES 
('Education'), 
('Environment'), 
('Humanitarian Aid');

-- Projects
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Ramp Construction', 'Improving community access.', '123 Main Street', '2026-06-01'),
(1, 'Roof Repair', 'Preventive maintenance for the community hall.', 'Community Center', '2026-06-15'),
(1, 'Facade Painting', 'Visual renovation of old buildings.', 'San Jose Neighborhood', '2026-06-20'),
(1, 'Bench Installation', 'New resting areas for the elderly.', 'Main Square', '2026-07-05'),
(1, 'Carpentry Workshop', 'Basic skill training for youth.', 'Central Workshop', '2026-07-12'),
(2, 'School Garden', 'Planting vegetables with students.', 'Primary School', '2026-05-25'),
(2, 'Composting Campaign', 'Organic waste management workshop.', 'Eco Park', '2026-06-08'),
(2, 'Seed Distribution', 'Support for urban farmers in the city.', 'Local Market', '2026-06-15'),
(2, 'Hydroponics Workshop', 'Soilless cultivation techniques.', 'North Greenhouse', '2026-06-22'),
(2, 'Harvest Fair', 'Sale of local organic products.', 'Central Plaza', '2026-07-01'),
(3, 'Charity Dinner', 'Fundraising for local orphanages.', 'Events Hall', '2026-06-05'),
(3, 'Medical Visit', 'Free basic healthcare for the homeless.', 'Mobile Clinic', '2026-06-12'),
(3, 'Book Drive', 'Collecting books for the library.', 'Cultural Center', '2026-06-19'),
(3, 'After-School Support', 'Math and reading tutoring sessions.', 'UnityServe HQ', '2026-07-02'),
(3, 'Park Cleanup', 'Maintenance of local green areas.', 'Sun Park', '2026-07-10');

-- Project Categories
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 3), (2, 3), (3, 3), (4, 3), (5, 1),
(6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
(11, 3), (12, 3), (13, 1), (14, 1), (15, 2);