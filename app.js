const inquirer = require("inquirer");
const connection = require("./include/db");
const cTable = require("console.table");

const choices = [
	"View All Employees",
	"View All Employees By Department",
	"View All Employees By Manager",
	"Add Employee",
	"Remove Employee",
	"Update Employee Role",
	"Update Employee Manager",
	"View All Roles",
	"Add Role",
	"Remove Role",
	"Quit"
];

const queryAllEmployees = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, r.title, d.name as department, r.salary, concat(m.first_name, " ", m.last_name) as Manager
FROM employee e
JOIN role r ON r.id = e.role_id
JOIN department d ON d.id = r.department_id
LEFT JOIN employee m ON e.manager_id = m.id;
`;

const queryAllEmployeesSimple = `SELECT id, concat(first_name, " ", last_name) AS name FROM employee`;

const queryAllManagers = `SELECT DISTINCT e.manager_id AS ID, concat(m.first_name, " ", m.last_name) AS Name FROM employee e
JOIN employee m ON e.manager_id = m.id `;

const queryEmployeesByManager = `SELECT e.id AS ID, concat(e.first_name, " ", e.last_name) AS Name FROM employee e
WHERE e.manager_id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = ?)
`;

const queryAllRoles = `SELECT id, title, salary FROM role`;

const queryRoleSimple = `SELECT id, title FROM role`;

const queryAllDepartments = `SELECT name FROM department`;

const queryEmployeesByDept = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, d.name as department
FROM employee e
JOIN role r on r.id = e.role_id
JOIN department d ON d.id = r.department_id
WHERE d.id = ?`;

const queryManagerByName = `select id from employee where concat(first_name, " ", last_name) = ?`;

const queryAddNewEmployee = `insert into employee ( first_name, last_name, role_id )
values 
	(?, ?, (select id from role where title = ?))`;

const queryUpdateManager = `UPDATE employee
SET manager_id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = ?) 
WHERE id = (SELECT id FROM (SELECT * FROM employee) AS A
            WHERE concat(first_name, " ", last_name) = ?)`;

const init = {
	type: "list",
	name: "action",
	message: "What would you like to do?",
	choices: choices
};

// 0: View All Employees
const getEmployees = function() {
	connection.query(queryAllEmployees, (err, res) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				id: item.id,
				name: item.name,
				title: item.title,
				department: item.department,
				salary: item.salary,
				manager: item.Manager
			};
			return newItem;
		});
		console.table(output);
		showQuestions();
	});
};

// 1: View All Employees By Department
const getEmployeesByDepartment = function() {
	connection.query(queryAllDepartments, (err, res, fields) => {
		if (err) throw err;
		const output = res.map(item => {
			return item.name;
		});
		inquirer
			.prompt({
				type: "list",
				name: "department",
				choices: output,
				message: "Which department do you want to check?",
				filter: function(val) {
					const departmentId = output.indexOf(val) + 1;
					return departmentId;
				}
			})
			.then(department => {
				connection.query(
					queryEmployeesByDept,
					[department.department],
					(err, res, fields) => {
						if (err) throw err;
						const output = res.map(item => {
							const newItem = {
								id: item.id,
								name: item.name,
								department: item.department
							};
							return newItem;
						});
						console.table(output);
						showQuestions();
					}
				);
			});
	});
};

// 2: View All Employees By Manager
const getEmployeesByManager = function() {
	connection.query(queryAllManagers, (err, res, fields) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				id: item.ID,
				name: item.Name
			};
			return newItem;
		});
		inquirer
			.prompt([
				{
					type: "list",
					name: "manager",
					choices: output,
					message: "Which manager do you want to view?"
				}
			])
			.then(manager => {
				console.log(manager);
				connection.query(
					queryEmployeesByManager,
					[manager.manager],
					(err, res, fields) => {
						if (err) throw err;
						const output = res.map(item => {
							const newItem = {
								id: item.ID,
								name: item.Name
							};
							return newItem;
						});
						console.table(output);
						showQuestions();
					}
				);
			});
	});
};

// 3: Add Employee
const addEmployee = function() {
	connection.query(queryRoleSimple, (err, res, fields) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				name: item.title
			};
			return newItem;
		});
		console.log(output);
		inquirer
			.prompt([
				{
					type: "input",
					name: "firstName",
					message: "What is the employees first name?"
				},
				{
					type: "input",
					name: "lastName",
					message: "What is the employees last name?"
				},
				{
					type: "list",
					name: "role",
					choices: output,
					message: "What is the employee's role?"
				}
			])
			.then(newEmployee => {
				connection.query(
					queryAddNewEmployee,
					[
						newEmployee.firstName,
						newEmployee.lastName,
						newEmployee.role
					],
					(err, res, fields) => {
						if (err) throw err;
						getEmployees();
					}
				);
			});
	});
};

// 4: Remove Employee
// 5: Update Employee Role

// 6: Update Employee Manager
const updateManager = function() {
	connection.query(queryAllEmployeesSimple, (err, res, fields) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				id: item.id,
				name: item.name
			};
			return newItem;
		});
		inquirer
			.prompt([
				{
					type: "list",
					name: "hasNewManager",
					choices: output,
					message: "Which employee has a new manager?"
				},
				{
					type: "list",
					name: "newManager",
					choices: output,
					message: "Who is going to be the new manager?"
				}
			])
			.then(answers => {
				// answers contains the names of the new manager and the employee
				// use these in the query to get and set the manager id.
				connection.query(
					queryUpdateManager,
					[answers.newManager, answers.hasNewManager],
					(err, res, fields) => {
						if (err) throw err;
						getEmployees();
					}
				);
			});
	});
};

// 7: View All Roles
const getRoles = function() {
	connection.query(queryAllRoles, (err, res) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				id: item.id,
				title: item.title,
				salary: item.salary
			};
			return newItem;
		});
		console.table(output);
		showQuestions();
	});
};

// 8: Add Role
// 9: Remove Role

const showQuestions = function() {
	inquirer.prompt(init).then(answers => {
		if (answers.action == choices[0]) {
			getEmployees();
		} else if (answers.action == choices[1]) {
			getEmployeesByDepartment();
		} else if (answers.action == choices[2]) {
			getEmployeesByManager();
		} else if (answers.action == choices[3]) {
			addEmployee();
		} else if (answers.action == choices[4]) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[5]) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[6]) {
			updateManager();
		} else if (answers.action == choices[7]) {
			getRoles();
		} else if (answers.action == choices[8]) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[9]) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[10]) {
			//return 0;
			process.exit();
		}
	});
};

showQuestions();
