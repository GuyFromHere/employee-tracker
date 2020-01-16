const inquirer = require("inquirer");
const db_conn = require("./include/db");
const questions = require("./include/questions");

const run = function() {
	return inquirer.prompt(questions).then(console.log("the end"));
};
