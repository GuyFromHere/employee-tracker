const inquirer = require("inquirer");
const connection = require("./include/db");
const cTable = require("console.table");

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
	],
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
	});
};

const getEmployees = function() {
	connection.query(queryAllEmployees, (err, res) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				id: item.id,
				name: item.name,
				title: item.title
			};
			return newItem;
		});
		console.log("\n");
		console.table(output);
	});
};

const question1 = function() {
	inquirer.prompt(init).then(answers => {
		if (answers.action == "view all employees") {
			getEmployees();
			question1();
		} else if (answers.action == "view all roles") {
			getRoles();
			question1();
		} else if ((answers.action = "quit")) {
			return 0;
		}
	});
};

question1();
