
DROP DATABASE IF EXISTS employeeTracker;
CREATE DATABASE IF NOT EXISTS employeeTracker;

USE employeeTracker;
CREATE TABLE department (
	id INT UNIQUE AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    primary key (id)
);

CREATE TABLE role (
	id INT UNIQUE AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id),
    primary key (id)
);

CREATE TABLE employee (
	id INT UNIQUE AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    department_id INT NOT NULL,
    role_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id),
    primary key (id)
);

-- SHOW TABLES;
-- INSERT INTO department (name)
-- VALUES ("Engineering"),("Finance"), ("Sales"), ("Legal");

-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Engineer", "60000.00", 
-- 	(SELECT id FROM department 
-- 	WHERE department.name = "Engineering")),
--     ("Accountant", "55000.00", 
-- 	(SELECT id FROM department 
-- 	WHERE department.name = "Finance")),
--     ("Salesperson", "70000.00", 
-- 	(SELECT id FROM department 
-- 	WHERE department.name = "Sales")),
--     ("Lawyer", "70000.00", 
-- 	(SELECT id FROM department 
-- 	WHERE department.name = "Legal"));

-- SELECT * FROM department;
-- SELECT title, department_id, d.name FROM role r
-- inner join department d on r.department_id = d.id