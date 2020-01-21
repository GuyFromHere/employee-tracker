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

const queryAllEmployees = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, r.title, d.name as department, r.salary, e.manager_id as Manager
FROM employee e
JOIN role r ON r.id = e.role_id
JOIN department d on d.id = r.department_id`;

const queryAllEmployeesSimple = `SELECT id, concat(first_name, " ", last_name) AS name FROM employee`;

const queryAllRoles = `SELECT id, title, salary FROM role`;

const queryAllDepartments = `SELECT name FROM department`;

const queryEmployeesByDept = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, d.name as department
FROM employee e
JOIN role r on r.id = e.role_id
JOIN department d ON d.id = r.department_id
WHERE d.id = ?`;

const queryManagerByName = `select id from employee where concat(first_name, " ", last_name) = ?`;

const queryUpdateManager = `UPDATE employee
SET manager_id = (SELECT id FROM (SELECT * FROM employee) AS A
				WHERE concat(first_name, " ", last_name) = ?) 
WHERE id = (SELECT id FROM (SELECT * FROM employee) AS A
            WHERE concat(first_name, " ", last_name) = ?)`;

const init = {
	type: "list",
	name: "action",
	message: "What would you like to do?",
	choices: choices,
	filter: function(val) {
		return val.toLowerCase();
	}
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
		console.log("\n\n");
		console.table(output);
		console.log("\n\n");
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
						console.log("\n\n");
						console.table(output);
						console.log("\n\n");
						showQuestions();
					}
				);
			});
	});
};

// 2: View All Employees By Manager
// 3: Add Employee
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
						// not really sure what gets returned from an update....
						//console.log(res);
						getEmployees();
					}
				);
				//showQuestions();
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
		console.log("\n");
		console.table(output);
		console.log("\n\n\n\n\n");
		showQuestions();
	});
};

// 8: Add Role
// 9: Remove Role

const showQuestions = function() {
	inquirer.prompt(init).then(answers => {
		if (answers.action == choices[0].toLowerCase()) {
			getEmployees();
		} else if (answers.action == choices[1].toLowerCase()) {
			getEmployeesByDepartment();
		} else if (answers.action == choices[2].toLowerCase()) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[3].toLowerCase()) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[4].toLowerCase()) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[5].toLowerCase()) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[6].toLowerCase()) {
			updateManager();
		} else if (answers.action == choices[7].toLowerCase()) {
			getRoles();
		} else if (answers.action == choices[8].toLowerCase()) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[9].toLowerCase()) {
			console.log("You selected " + answers.action);
		} else if (answers.action == choices[10].toLowerCase()) {
			//return 0;
			process.exit();
		}
	});
};

showQuestions();
