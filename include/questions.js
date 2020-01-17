module.exports = [
	{
		type: "input",
		name: "start",
		message: "Hello!"
	},
	{
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
			"Update Employee Manager"
		]
	},
	{
		type: "input",
		name: "first_name",
		message: "Enter the employee's first name:",
		when: function (answers) {
			return answers.action == "Add Employee";
		}
	},
	{
		type: "input",
		name: "last_name",
		message: "Enter the employee's last name:",
		when: function (answers) {
			return answers.first_name != "";
		}
	}
];
