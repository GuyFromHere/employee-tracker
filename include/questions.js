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
		name: "viewAll",
		message: "View Roles:", // test running sql based on this.
		when: function(answers) {
			return answers.action == "View All Employees";
		}
	},
	{
		type: "input",
		name: "first_name",
		message: "Enter the Employee's first name:",
		when: function(answers) {
			return answers.action == "Add Employee";
		}
	},
	{
		type: "input",
		name: "last_name",
		message: "Enter the Employee's last name:",
		when: function(answers) {
			return answers.first_name !== "";
		}
	},
	{
		type: "list",
		name: "empRole",
		message: "What is the employee's role?",
		choices: [
			"Lead Engineer",
			"Sales Lead",
			"Salesperson",
			"Accountant",
			"Legal Team Lead",
			"Lawyer",
			"Engineer"
		]
	},
	{
		type: "list",
		name: "empManager",
		message: "Who is the employee's manager?",
		choices: []
	}
];
