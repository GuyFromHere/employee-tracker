module.exports = [
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
		message: "Enter the Employee's first name:",
		when: function(answers) {
			return answers.action == "Add Employee";
		}
	}
];
