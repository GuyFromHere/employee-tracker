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

const queryAllRoles = `SELECT id, title, salary FROM role`;

const queryAllDepartments = `SELECT name FROM department`;

const queryEmployeesByDept = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, d.name as department
FROM employee e
JOIN role r on r.id = e.role_id
JOIN department d ON d.id = r.department_id
WHERE d.id = ?`;

const init = {
	type: "list",
	name: "action",
	message: "What would you like to do?",
	choices: choices,
	filter: function(val) {
		return val.toLowerCase();
	}
};

// populate roles list
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
	});
};

const getEmployees = function() {
	connection.query(queryAllEmployees, (err, res) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				id: item.id,
				name: item.name,
				title: item.title,
				department: item.department,
				salary: item.salary
			};
			return newItem;
		});
		console.log("\n");
		console.table(output);
		console.log("\n\n\n\n\n");
	});
};

const getEmployeesByDepartment = function() {
	connection.query(queryAllDepartments, (err, res, fields) => {
		if (err) throw err;
		const output = res.map(item => {
			return item.name;
		});
		console.log(output);
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
						console.log("\n");
						console.table(output);
						console.log("\n\n\n\n\n");
					}
				);
			});
	});
};

const showQuestions = function() {
	inquirer.prompt(init).then(answers => {
		if (answers.action == choices[0].toLowerCase()) {
			getEmployees();
			showQuestions();
		} else if (answers.action == choices[1].toLowerCase()) {
			getEmployeesByDepartment();
			showQuestions();
		} else if (answers.action == choices[2].toLowerCase()) {
			console.log("You selected " + answers.action);
			showQuestions();
		} else if (answers.action == choices[3].toLowerCase()) {
			console.log("You selected " + answers.action);
			showQuestions();
		} else if (answers.action == choices[4].toLowerCase()) {
			console.log("You selected " + answers.action);
			showQuestions();
		} else if (answers.action == choices[5].toLowerCase()) {
			console.log("You selected " + answers.action);
			showQuestions();
		} else if (answers.action == choices[6].toLowerCase()) {
			console.log("You selected " + answers.action);
			showQuestions();
		} else if (answers.action == choices[7].toLowerCase()) {
			getRoles();
			showQuestions();
		} else if (answers.action == choices[8].toLowerCase()) {
			console.log("You selected " + answers.action);
			showQuestions();
		} else if (answers.action == choices[9].toLowerCase()) {
			console.log("You selected " + answers.action);
			showQuestions();
		} else if (answers.action == choices[10].toLowerCase()) {
			return 0;
		}
	});
};

showQuestions();
