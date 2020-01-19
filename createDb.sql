
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
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT UNIQUE AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    primary key (id)
);

-- SHOW TABLES;
INSERT INTO department (name)
VALUES ("Engineering"),("Finance"), ("Sales"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES 
	("Engineer", "60000.00", 
		(SELECT id FROM department 
		WHERE department.name = "Engineering")),
    ("Accountant", "55000.00", 
		(SELECT id FROM department 
		WHERE department.name = "Finance")),
    ("Salesperson", "70000.00", 
		(SELECT id FROM department 
		WHERE department.name = "Sales")),
     ("Lawyer", "70000.00", 
		(SELECT id FROM department 
		WHERE department.name = "Legal")),
    ("Lead Engineer", "75000.00", 
		(SELECT id FROM department 
		WHERE department.name = "Engineering")),
 	("Sales Lead", "85000.00", 
		(SELECT id FROM department 
		WHERE department.name = "Sales")),
	("Legal Team Lead", "85000.00", 
		(SELECT id FROM department 
		WHERE department.name = "Legal"));



-- Seed Managers
insert into employee ( first_name, last_name, role_id )
values 
	("Dan", "Dismuke", 
        (select id from role where title = "Lead Engineer")),
	("Adria", "Decker",
        (select id from role where title = "Sales Lead")),
	("Big", "Bird",
		(select id from role where title = "Legal Team Lead"));
        
-- Seed Employees
insert into employee ( first_name, last_name, role_id)
values 
	("Sean", "Dismuke", 
        (select id from role where title = "Engineer")),
	("Adria", "Decker",
        (select id from role where title = "Salesperson"));
        
-- SELECT * FROM department;
-- SELECT title, department_id, d.name FROM role r
-- inner join department d on r.department_id = d.id
-- show employees with title and manager
-- select e.id, concat(e.first_name, " ", e.last_name) as name, r.title, e.manager_id
-- from employee e 
-- join role r on e.;

-- update employee manager

-- View All Employees
SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, r.title, d.name as department, r.salary, e.manager_id as Manager
FROM employee e
JOIN role r ON r.id = e.role_id
JOIN department d on d.id = r.department_id;

-- View all Employees by department 
-- First get list of departments to show:
SELECT name from department;

-- Then query for employees in the desired department (using department.id 1 here for testing)
SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, d.name as department
FROM employee e
JOIN role r on r.id = e.role_id
JOIN department d ON d.id = r.department_id
WHERE d.id = 1;



-- view all employees by manager
-- add employee
-- remove employee
-- update employee role
-- update employee manager

-- view all roles
SELECT id, title, salary FROM role;

-- add role
INSERT INTO role 
(title, salary, department_id)
VALUES 
	("[TITLE]", "[SALARY]", 
		(SELECT id FROM department 
		WHERE department.name = "[DEPARTMENT NAME]")),
-- remove role

    