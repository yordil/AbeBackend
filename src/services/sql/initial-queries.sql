-- Customers tables  
CREATE TABLE IF NOT EXISTS customer_identifier (
  customer_id SERIAL PRIMARY KEY,
  customer_email VARCHAR(255) UNIQUE NOT NULL,
  customer_phone_number VARCHAR(255) NOT NULL,
  customer_added_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  customer_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_info (
  customer_info_id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customer_identifier(customer_id) ON DELETE CASCADE, 
  customer_first_name VARCHAR(255) NOT NULL,
  customer_last_name VARCHAR(255) NOT NULL,
  active_customer_status INT NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_vehicle_info (
  vehicle_id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customer_identifier(customer_id) ON DELETE CASCADE, 
  vehicle_year INT NOT NULL,
  vehicle_make VARCHAR(255) NOT NULL,
  vehicle_model VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(255) NOT NULL,
  vehicle_mileage INT NOT NULL, 
  vehicle_tag VARCHAR(255) NOT NULL,
  vehicle_serial VARCHAR(255) NOT NULL,
  vehicle_color VARCHAR(255) NOT NULL
);

-- Company tables 
CREATE TABLE IF NOT EXISTS company_roles (
  company_role_id SERIAL PRIMARY KEY,
  company_role_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS common_services (
  service_id SERIAL PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  service_description TEXT
);

-- Employee tables 
CREATE TABLE IF NOT EXISTS employee (
  employee_id SERIAL PRIMARY KEY,
  employee_email VARCHAR(255) UNIQUE NOT NULL,
  active_employee INT NOT NULL,
  added_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_info (
  employee_info_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
  employee_first_name VARCHAR(255) NOT NULL,
  employee_last_name VARCHAR(255) NOT NULL,
  employee_phone VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS employee_pass (
  employee_pass_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
  employee_password_hashed VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS employee_role (
  employee_role_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
  company_role_id INT NOT NULL REFERENCES company_roles(company_role_id)
);

-- Order tables  
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE, 
  customer_id INT NOT NULL REFERENCES customer_identifier(customer_id) ON DELETE CASCADE,
  vehicle_id INT NOT NULL REFERENCES customer_vehicle_info(vehicle_id) ON DELETE CASCADE,
  order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  active_order INT NOT NULL,
  order_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_info (
  order_info_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  order_total_price INT NOT NULL DEFAULT 1000,
  estimated_completion_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completion_date TIMESTAMPTZ,
  additional_request TEXT,
  notes_for_internal_use TEXT,
  notes_for_customer TEXT,
  additional_requests_completed INT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_services (
  order_service_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES common_services(service_id),
  service_completed INT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_status (
  order_status_id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  order_status INT NOT NULL
);

-- Add the roles to the database 
INSERT INTO company_roles (company_role_name)
VALUES ('Employee'), ('Manager'), ('Admin');

-- This is the admin account 
INSERT INTO employee (employee_email, active_employee, added_date)
VALUES ('admin@admin.com', 1, CURRENT_TIMESTAMP);

INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone)
VALUES (1, 'Admin', 'Admin', '555-555-5555'); 

-- Password is 123456
INSERT INTO employee_pass (employee_id, employee_password_hashed)
VALUES (1, '$2b$10$B6yvl4hECXploM.fCDbXz.brkhmgqNlawh9ZwbfkFX.F3xrs.15Xi');  

INSERT INTO employee_role (employee_id, company_role_id)
VALUES (1, 3);
