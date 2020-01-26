const inquirer = require("inquirer");
const connection = require("./include/db");
const cTable = require("console.table");
const queries = require("./include/queries.js");

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
	"View Departments",
	"Add Department",
	"Remove Department",
	"Quit"
];

const init = {
	type: "list",
	name: "action",
	message: "What would you like to do?",
	choices: choices
};

// 0: View All Employees
const getEmployees = function() {
	connection.query(queries.allEmployees, (err, res) => {
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
		console.table(output);
		showQuestions();
	});
};

// 1: View All Employees By Department
const getEmployeesByDepartment = function() {
	connection.query(queries.allDepartments, (err, res, fields) => {
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
					queries.employeesByDept,
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
						console.table(output);
						showQuestions();
					}
				);
			});
	});
};

// 2: View All Employees By Manager
const getEmployeesByManager = function() {
	connection.query(queries.allManagers, (err, res, fields) => {
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
					name: "manager",
					choices: output,
					message: "Which manager do you want to view?"
				}
			])
			.then(manager => {
				connection.query(
					queries.employeesByManager,
					[manager.manager],
					(err, res, fields) => {
						if (err) throw err;
						const output = res.map(item => {
							const newItem = {
								id: item.id,
								name: item.name
							};
							return newItem;
						});
						console.table(output);
						showQuestions();
					}
				);
			});
	});
};

// 3: Add Employee
const addEmployee = function() {
	connection.query(
		`${queries.allRoles}${queries.allManagers}`,
		(err, res, fields) => {
			if (err) throw err;
			// multi-query returns results to both queries in an array
			// get roles from first index
			const roles = res[0].map(item => {
				const newItem = {
					name: item.title
				};
				return newItem;
			});
			// get managers from second index
			const managers = res[1].map(item => {
				const newItem = {
					name: item.name
				};
				return newItem;
			});
			// Add a 'None' option if the employee is not to have a manager
			managers.push({ name: "None" });
			inquirer
				.prompt([
					{
						type: "input",
						name: "firstName",
						message: "What is the employees first name?"
					},
					{
						type: "input",
						name: "lastName",
						message: "What is the employees last name?"
					},
					{
						type: "list",
						name: "role",
						choices: roles,
						message: "What is the employee's role?"
					},
					{
						type: "list",
						name: "newManager",
						choices: managers,
						message: "Who is the employee's manager?"
					}
				])
				.then(newEmployee => {
					connection.query(
						queries.addNewEmployee,
						[
							newEmployee.firstName,
							newEmployee.lastName,
							newEmployee.role,
							newEmployee.newManager
						],
						(err, res, fields) => {
							if (err) throw err;
							getEmployees();
						}
					);
				});
		}
	);
};

// 4: Remove Employee
const removeEmployee = function() {
	connection.query(queries.allEmployeesSimple, (err, res, fields) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				name: item.name
			};
			return newItem;
		});
		inquirer
			.prompt([
				{
					type: "list",
					name: "employee",
					choices: output,
					message: "Which employee would you like to remove?"
				}
			])
			.then(employee => {
				connection.query(
					queries.removeEmployee,
					[employee.employee],
					(err, res, fields) => {
						if (err) throw err;
						console.log(
							"Successfully removed employee " + employee.employee
						);
						getEmployees();
					}
				);
			});
	});
};

// 5: Update Employee Role
const updateRole = function() {
	// select employee to update then select the new role
	connection.query(
		`${queries.allEmployeesSimple}${queries.allRoles};`,
		(err, res, fields) => {
			if (err) throw err;
			const employees = res[0].map(item => {
				const newItem = {
					id: item.id,
					name: item.name
				};
				return newItem;
			});
			const roles = res[1].map(item => {
				const newItem = {
					id: item.id,
					name: item.title
				};
				return newItem;
			});
			inquirer
				.prompt([
					{
						type: "list",
						name: "hasNewRole",
						choices: employees,
						message: "Which employee would you like to update?"
					},
					{
						type: "list",
						name: "newRole",
						choices: roles,
						message: "What is thier new role?"
					}
				])
				.then(answers => {
					connection.query(
						queries.updateEmployeeRole,
						[answers.newRole, answers.hasNewRole],
						(err, res, fields) => {
							if (err) throw err;
							getEmployees();
						}
					);
				});
		}
	);
};

// 6: Update Employee Manager
const updateManager = function() {
	connection.query(queries.allEmployeesSimple, (err, res, fields) => {
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
				connection.query(
					queries.updateManager,
					[answers.newManager, answers.hasNewManager],
					(err, res, fields) => {
						if (err) throw err;
						getEmployees();
					}
				);
			});
	});
};

// 7: View All Roles
const getAllRoles = function() {
	connection.query(queries.allRoles, (err, res) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				id: item.id,
				title: item.title,
				salary: item.salary
			};
			return newItem;
		});
		console.table(output);
		showQuestions();
	});
};

// 8: Add Role
// get title, salary, department_id (from department) of new role.
const addRole = function() {
	connection.query(queries.allDepartments, (err, res, fields) => {
		if (err) throw err;
		const departments = res.map(item => {
			const newItem = {
				name: item.name
			};
			return newItem;
		});
		inquirer
			.prompt([
				{
					type: "list",
					name: "department",
					choices: departments,
					message: "What department does this role belong in?"
				},
				{
					type: "input",
					name: "newRole",
					message: "What is the name of the new role?"
				},
				{
					type: "input",
					name: "salary",
					message: "What is the starting salary?"
				}
			])
			.then(answers => {
				connection.query(
					queries.addRole,
					[answers.newRole, answers.salary, answers.department],
					(err, res, fields) => {
						if (err) throw err;
						console.log(
							"Successfully added the " +
								answers.newRole +
								" role."
						);
						showQuestions();
					}
				);
			});
	});
};

// 9: Remove Role
const removeRole = function() {
	connection.query(queries.allRoles, (err, res, fields) => {
		if (err) throw err;
		const output = res.map(item => {
			const newItem = {
				name: item.title
			};
			return newItem;
		});
		inquirer
			.prompt([
				{
					type: "list",
					name: "roles",
					choices: output,
					message: "What role do you want to remove?"
				}
			])
			.then(answers => {
				connection.query(
					queries.removeRole,
					[answers.roles],
					(err, res, fields) => {
						if (err) throw err;
						console.log(
							"Successfully removed role " + answers.roles
						);
						showQuestions();
					}
				);
			});
	});
};

// Get All Departments
const getAllDepartments = function() {
	connection.query(queries.allDepartments, (err, result, fields) => {
		if (err) throw err;
		const output = result.map(item => {
			const newItem = {
				id: item.id,
				name: item.name
			};
			return newItem;
		});
		console.table(output);
		showQuestions();
	});
};

// Add Department
const addDepartment = function() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "newDepartment",
				message: "What is the name of the new department?"
			}
		])
		.then(answers => {
			connection.query(
				queries.addDepartment,
				[answers.newDepartment],
				(err, result, fields) => {
					if (err) throw err;
					console.log(
						"Successfully added the " +
							answers.newDepartment +
							" department."
					);
					showQuestions();
				}
			);
		});
};

// Remove
const removeDepartment = function() {
	connection.query(queries.allDepartments, (err, result) => {
		if (err) throw err;
		const output = result.map(item => {
			const newItem = {
				name: item.name
			};
			return newItem;
		});
		inquirer
			.prompt([
				{
					type: "list",
					name: "departments",
					choices: output,
					message: "What department do you want to remove?"
				}
			])
			.then(answers => {
				connection.query(
					queries.removeDepartment,
					[answers.departments],
					(err, result, fields) => {
						if (err) throw err;
						console.log(
							"Successfully removed department " +
								answers.department
						);
						showQuestions();
					}
				);
			});
	});
};

const showQuestions = function() {
	inquirer.prompt(init).then(answers => {
		switch (answers.action) {
			case "View All Employees":
				getEmployees();
				break;
			case "View All Employees By Department":
				getEmployeesByDepartment();
				break;
			case "View All Employees By Manager":
				getEmployeesByManager();
				break;
			case "Add Employee":
				addEmployee();
				break;
			case "Remove Employee":
				removeEmployee();
				break;
			case "Update Employee Role":
				updateRole();
				break;
			case "Update Employee Manager":
				updateManager();
				break;
			case "View All Roles":
				getAllRoles();
				break;
			case "Add Role":
				addRole();
				break;
			case "Remove Role":
				removeRole();
				break;
			case "View Departments":
				getAllDepartments();
				break;
			case "Add Department":
				addDepartment();
				break;
			case "Remove Department":
				removeDepartment();
				break;
			case "Quit":
				connection.end();
				process.exit();
				break;
		}
	});
};

showQuestions();
