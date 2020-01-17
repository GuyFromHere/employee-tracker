CREATE DATABASE
IF NOT EXISTS employeeTracker;


USE employeeTracker;
CREATE TABLE department (
	id INT UNIQUE AUTO_INCREMENT NOT NULL,
    name VARCHAR
(30) NOT NULL,
    primary key
(id)
);

CREATE TABLE role (
	id INT UNIQUE AUTO_INCREMENT NOT NULL,
    title VARCHAR
(30) NOT NULL,
    salary DECIMAL
(3) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY
(department_id) REFERENCES department
(id),
    primary key
(id)
);

CREATE TABLE employee (
	id INT UNIQUE AUTO_INCREMENT NOT NULL,
    first_name VARCHAR
(30) NOT NULL,
    last_name VARCHAR
(30) NOT NULL,
    FOREIGN KEY
(department_id) REFERENCES department
(id) NOT NULL,
    role_id INT,
    primary key
(id)
);

INSERT INTO department
    (name)
VALUES("Engineering", "Accounting", "Legal", "Sales", "Finance");

INSERT INTO role
    (title, salary, department_id)
VALUES()
