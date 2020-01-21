const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	user: "dbUser",
	password: "How do you like my password?",
	database: "employeeTracker",
	multipleStatements: true
});

connection.connect(err => {
	if (err) throw err;
});

module.exports = connection;
