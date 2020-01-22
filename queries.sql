-- SELECT * FROM department;
-- SELECT title, department_id, d.name FROM role r
-- inner join department d on r.department_id = d.id
-- show employees with title and manager
-- select e.id, concat(e.first_name, " ", e.last_name) as name, r.title, e.manager_id
-- from employee e 
-- join role r on e.;

-- View All Employees and managers
SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, r.title, d.name as department, r.salary, concat(m.first_name, " ", m.last_name) as Manager
FROM employee e
JOIN role r ON r.id = e.role_id
JOIN department d ON d.id = r.department_id
LEFT JOIN employee m ON e.manager_id = m.id;

-- View all Employees by department 
-- First get list of departments to show:
SELECT name from department;

-- Then query for employees in the desired department (using department.id 1 here for testing)
SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, d.name as department
FROM employee e
JOIN role r on r.id = e.role_id
JOIN department d ON d.id = r.department_id
WHERE d.id = 1;

-- view all managers
SELECT DISTINCT e.manager_id AS ID, concat(m.first_name, " ", m.last_name) AS Name FROM employee e
JOIN employee m ON e.manager_id = m.id; 

-- view all employees of a manager
SELECT e.id AS ID, concat(e.first_name, " ", e.last_name) AS Name FROM employee e
WHERE e.manager_id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = 'Dan Dismuke');
                
-- add employee
SELECT id, title FROM role;
insert into employee ( first_name, last_name, role_id )
values 
	("Ronald", "McDonald", 
        (select id from role where title = "Salesperson"));

-- remove employee
DELETE FROM employee 
WHERE concat(first_name, ' ', last_name) = ?;

-- update employee role
UPDATE employee 
	SET role_id = (SELECT id FROM (SELECT * FROM role) AS A 
					WHERE title = ?) 
	WHERE id = (SELECT id from (SELECT * FROM employee) AS A 
					WHERE concat(first_name, " ", last_name) = ?);

-- update employee manager
-- First show list of all employees
SELECT id, concat(first_name, " ", last_name) as name FROM employee;
-- Update employee manager_id (given employee name "Sean Dismuke" and manager name "Dan Dismuke"
UPDATE employee
SET manager_id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = 'Dan Dismuke')
WHERE id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = 'Sean Dismuke');
select * from employee;


-- view all roles
SELECT id, title, salary FROM role;

-- add role
INSERT INTO role 
(title, salary, department_id)
VALUES 
	("[TITLE]", "[SALARY]", 
		(SELECT id FROM department 
		WHERE department.name = "[DEPARTMENT NAME]"));
-- remove role
DELETE FROM role
WHERE title = ?;