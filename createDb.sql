
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
	("Zinnia", "Dismuke",
        (select id from role where title = "Salesperson")),
    ("Little", "Bird",
        (select id from role where title = "Lawyer"));    


    