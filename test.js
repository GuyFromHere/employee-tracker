const inquirer = require("inquirer");
const connection = require("./include/db");

const queryAllEmployees = `SELECT e.id, concat(e.first_name, " ", e.last_name) AS name, r.title from employee e
JOIN role r ON r.id = e.role_id`;

const queryAllRoles = `SELECT id, title, salary FROM role`;

const init = {
	type: "list",
	name: "action",
	message: "What would you like to do?",
	choices: [
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
	]
};

// populate roles list
const getRoles = function() {
	connection.query("SELECT id, title, salary FROM role", (err, res) => {
		if (err) throw err;
		res.forEach(item => {
			console.log(item);
		});
	});
};

// if user selects view...
const getEmployees = function() {
	connection.query(queryAllEmployees, (err, res) => {
		res.forEach(item => {
			console.log(item);
		});
	});
};

const question1 = function() {
	inquirer.prompt(init).then(answers => {
		if ((answers.action = "View All Employees")) {
			getEmployees();
			question1();
		}
		if ((answers.action = "View All Roles")) {
			getRoles();
			question1();
		}
		if ((answers.action = "Quit")) {
			return 0;
		}
	});
};

question1();
