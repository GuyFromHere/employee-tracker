const inquirer = require("inquirer");
const Rx = require("rxjs");

const prompts = new Rx.Subject();
inquirer.prompt(prompts);

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

const init = {
	type: "list",
	name: "action",
	message: "What would you like to do?",
	choices: choices,
	filter: function(val) {
		return val.toLowerCase();
	}
};

const output = [
	{ id: 1, name: "Dan Dismuke" },
	{ id: 2, name: "Adria Decker" },
	{ id: 3, name: "Big Bird" },
	{ id: 4, name: "Sean Dismuke" },
	{ id: 5, name: "Adria Decker" }
];

const updateManager = function() {
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
				message: "Who is their manager?"
			}
		])
		.then(answers => {
			console.log(answers);
			showQuestions();
		});
};

const showQuestions = function() {
	inquirer.prompt(init).then(answers => {
		if (answers.action == choices[6].toLowerCase()) {
			updateManager();
		} else {
			console.log("You selected " + answers.action);
		}
	});
};

showQuestions();
