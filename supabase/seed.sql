-- =============================================
-- Seed Data — Denis Hain's Portfolio
-- Run AFTER schema.sql, AFTER creating your admin account
-- Replace 'YOUR_USER_ID_HERE' with your Supabase auth.users UUID
-- =============================================

-- PROFILE
INSERT INTO profiles (user_id, name, title, bio, phone, email, github, portfolio_url)
VALUES (
  '1c4d51f9-32bf-48a0-aa8b-16f8333b2304',
  'Sherwin Christopher F. Roxas',
  'Full Stack Developer',
  'Passionate Full Stack Developer with 7+ years of experience building scalable web and mobile applications. Specialized in React/Next.js and Laravel ecosystems, with a strong foundation in both frontend and backend development. Led development of enterprise systems for NYK-Fil Maritime E-Training, Inc., delivering solutions that streamline operations across web and mobile platforms.',
  '+(63) 950 909 5677',
  'scfr.dev.96@gmail.com',
  'https://github.com/MysticMaccc',
  'https://sfr-portfolio-2026.vercel.app'
);

-- EXPERIENCES
INSERT INTO experiences (company, role, start_date, end_date, is_current, description, order_index) VALUES
(
  'NYK-FIL Maritime E-Training, Inc.',
  'Senior Developer',
  '2021',
  '2025',
  false,
  ARRAY[
    'Led development of enterprise-level web and mobile applications',
    'Architected and built Online Enrollment System and Mobile App (Android & iOS)',
    'Developed SpoonPH Fitness App (web + Android/iOS) using React and Capacitor JS',
    'Managed project planning, timelines, WBS creation, and resource allocation',
    'Conducted code reviews and mentored junior developers',
    'Implemented REST API development and JWT authentication systems',
    'Facilitated Scrum ceremonies and managed sprint planning'
  ],
  0
),
(
  'NYK-FIL Maritime E-Training, Inc.',
  'Junior Developer',
  '2018',
  '2021',
  false,
  ARRAY[
    'Developed and maintained internal web applications using Laravel framework',
    'Built Meal Tracker, Library Management, and Telephone Directory systems',
    'Created Procurement and Inventory management systems',
    'Developed Work Order Monitoring and Lecturer Payroll systems',
    'Worked with Laravel framework, MySQL databases, and Bootstrap CSS'
  ],
  1
);

-- PROJECTS
INSERT INTO projects (title, description, tech_stack, category, featured, order_index) VALUES
('Online Enrollment System', 'Full-featured online enrollment platform with admin dashboard, student portal, and real-time reporting for maritime training programs.', ARRAY['Laravel', 'React', 'MySQL', 'Tailwind CSS'], 'web', true, 0),
('Online Enrollment Android & iOS App', 'Cross-platform mobile application for the enrollment system with native device features and offline support.', ARRAY['React', 'Next.js', 'Capacitor JS', 'Tailwind CSS'], 'mobile', true, 1),
('SpoonPH Fitness App', 'Nutrition and fitness tracking web application with meal planning, calorie tracking, and progress monitoring features.', ARRAY['Laravel', 'Vue.js', 'MySQL', 'Bootstrap CSS'], 'web', true, 2),
('SpoonPH Fitness Android & iOS App', 'Mobile version of the SpoonPH fitness application with native features and offline support.', ARRAY['React', 'Capacitor JS', 'Tailwind CSS'], 'mobile', false, 3),
('Procurement System', 'End-to-end procurement management system with purchase orders, vendor management, and approval workflows.', ARRAY['Laravel', 'Livewire', 'Alpine.js', 'Tailwind CSS'], 'web', false, 4),
('Inventory System', 'Comprehensive inventory management system with stock tracking, barcode support, and automated reorder alerts.', ARRAY['Laravel', 'MySQL', 'Bootstrap CSS', 'JavaScript'], 'web', false, 5),
('NYK Lecturer Payroll System', 'Automated payroll processing system for lecturers with attendance tracking, tax computation, and payslip generation.', ARRAY['Laravel', 'MySQL', 'Blade', 'Bootstrap CSS'], 'web', false, 6),
('Work Order Monitoring System', 'Real-time work order tracking and management system with status updates, assignments, and reporting dashboard.', ARRAY['Laravel', 'Livewire', 'MySQL', 'Tailwind CSS'], 'web', false, 7),
('Library System', 'Digital library management system with book cataloging, member management, and borrowing/return tracking.', ARRAY['Laravel', 'MySQL', 'Bootstrap CSS', 'jQuery'], 'web', false, 8),
('Meal Tracker System', 'Cafeteria meal tracking system with daily menu management, consumption logging, and nutritional reporting.', ARRAY['Laravel', 'MySQL', 'Blade', 'CSS'], 'web', false, 9),
('Telephone Directory System', 'Internal telephone directory with department search, contact management, and quick-dial features.', ARRAY['Laravel', 'MySQL', 'Bootstrap CSS'], 'web', false, 10);

-- SKILLS
INSERT INTO skills (category, name, level, order_index) VALUES
('Full Stack', 'React (Next.js) + Laravel', 'advanced', 0),
('Full Stack', 'TALL Stack (Tailwind, Alpine, Laravel, Livewire)', 'advanced', 1),
('Frontend', 'React JS', 'advanced', 0),
('Frontend', 'TypeScript', 'intermediate', 1),
('Frontend', 'Next.js', 'advanced', 2),
('Frontend', 'Laravel Livewire', 'advanced', 3),
('Frontend', 'Alpine.js', 'intermediate', 4),
('Backend', 'Laravel Framework', 'advanced', 0),
('Backend', 'REST API Development', 'advanced', 1),
('Backend', 'API Authentication & Authorization', 'advanced', 2),
('Fundamentals', 'HTML', 'advanced', 0),
('Fundamentals', 'CSS', 'advanced', 1),
('Fundamentals', 'JavaScript', 'advanced', 2),
('Fundamentals', 'PHP', 'advanced', 3),
('CSS Frameworks', 'Tailwind CSS', 'advanced', 0),
('CSS Frameworks', 'Bootstrap CSS', 'advanced', 1),
('Database', 'MySQL', 'advanced', 0),
('Database', 'Supabase (PostgreSQL)', 'intermediate', 1),
('Cloud & Hosting', 'Vercel', 'intermediate', 0),
('Cloud & Hosting', 'Hostinger', 'intermediate', 1),
('Cloud & Hosting', 'GoDaddy', 'intermediate', 2),
('Version Control', 'Git', 'advanced', 0),
('Version Control', 'GitHub', 'advanced', 1),
('Package Managers', 'Composer', 'advanced', 0),
('Package Managers', 'npm', 'advanced', 1),
('Package Managers', 'Yarn', 'intermediate', 2),
('Mobile', 'React Native (Capacitor JS)', 'intermediate', 0),
('Mobile', 'Android App Development', 'intermediate', 1),
('Mobile', 'iOS App Development', 'intermediate', 2),
('Methodologies', 'Object Oriented Programming', 'advanced', 0),
('Methodologies', 'Model-View-Controller (MVC)', 'advanced', 1),
('Methodologies', 'Test Driven Development', 'intermediate', 2),
('Methodologies', 'Scrum / Agile', 'advanced', 3),
('Project Management', 'Project Planning & Scheduling', 'advanced', 0),
('Project Management', 'Scope Management', 'advanced', 1),
('Project Management', 'Sprint Facilitation', 'advanced', 2),
('Project Management', 'Technical Specification Drafting', 'advanced', 3),
('Project Management', 'Notion', 'intermediate', 4);

-- TRAININGS
INSERT INTO trainings (title, provider, year, order_index) VALUES
('SCRUM Master Certified Training', 'APEX Global', '2023', 0),
('Basic iOS Mobile Application Development', 'FIT Academy', '2022', 1),
('Advance Android Application Development', 'FIT Academy', '2021', 2),
('Basic Android Application Development', 'FIT Academy', '2020', 3),
('Laravel Framework', 'Inventive Media', '2019', 4),
('Laravel + Vue JS', 'Udemy', '2021', 5),
('Chat GPT Master Course', 'Udemy', '2023', 6),
('WordPress Development', 'Udemy', '2020', 7),
('Bootstrap CSS Framework', 'Udemy', '2019', 8),
('Advanced CSS & Sass', 'Udemy', '2019', 9);
