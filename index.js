const inquirer = require("inquirer");
const db_conn = require("./include/db");
const questions = require("./include/questions");

function processAnswers(answers) {
	console.log("And your answers are:", answers);
	if (answers.action == "View All Employees") {
		db_conn.query(
			"SELECT * FROM employeeTracker.employees",
			(err, result) => {
				if (err) throw err;
				const stringResult = JSON.stringify(result);
				const parsedResult = JSON.parse(stringResult);
				parsedResult.forEach(item => {
					console.log(item.first_name + " " + item.last_name);
				});
			}
		);
	} else if (answers.action == "Add Employee") {
		console.log("Add " + answers.first_name + " to database.");
	}
}

const run = function () {
	return inquirer.prompt(questions).then(answers => {
		//processAnswers(answers);
	});
};

run();
