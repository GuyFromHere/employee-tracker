const queryAllEmployees = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, r.title, d.name as department, r.salary, concat(m.first_name, " ", m.last_name) as Manager
FROM employee e
JOIN role r ON r.id = e.role_id
JOIN department d ON d.id = r.department_id
LEFT JOIN employee m ON e.manager_id = m.id;
`;

const queryAllEmployeesSimple = `SELECT id, concat(first_name, " ", last_name) AS name FROM employee`;

const queryAllManagers = `SELECT DISTINCT e.manager_id AS ID, concat(m.first_name, " ", m.last_name) AS name 
                        FROM employee e
                        JOIN employee m ON e.manager_id = m.id;`;

const queryEmployeesByManager = `SELECT e.id AS ID, concat(e.first_name, " ", e.last_name) AS Name FROM employee e
WHERE e.manager_id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = ?)
`;

const queryAllRoles = `SELECT id, title, salary FROM role;`;

const queryAllDepartments = `SELECT name FROM department`;

const queryEmployeesByDept = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, d.name as department
							FROM employee e
							JOIN role r on r.id = e.role_id
							JOIN department d ON d.id = r.department_id
							WHERE d.id = ?`;

const queryAddNewEmployee = `insert into employee ( first_name, last_name, role_id, manager_id )
values 
	(?, ?, (select id from role where title = ?),
        (select id from  (SELECT * FROM employee) AS A 
			where id = (select id from  (SELECT * FROM employee) AS A
						where concat(first_name, " ", last_name) = ?
                        )
		)
	);`;

const queryRemoveEmployee = `DELETE FROM employee WHERE concat(first_name, ' ', last_name) = ?`;

const queryUpdateEmployeeRole = `UPDATE employee 
	SET role_id = (SELECT id FROM (SELECT * FROM role) AS A 
					WHERE title = ?) 
	WHERE id = (SELECT id from (SELECT * FROM employee) AS A 
					WHERE concat(first_name, " ", last_name) = ?);`;

const queryUpdateManager = `UPDATE employee
SET manager_id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = ?) 
WHERE id = (SELECT id FROM (SELECT * FROM employee) AS A
            WHERE concat(first_name, " ", last_name) = ?)`;

const queryAddRole = `INSERT INTO role 
(title, salary, department_id)
VALUES 
	(?, ?, 
		(SELECT id FROM department 
		WHERE department.name = ?));`;

const queryRemoveRole = `DELETE FROM role
                        WHERE title = ?;`;
