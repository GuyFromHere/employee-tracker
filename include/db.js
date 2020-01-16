const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	user: "dbUser",
	password: "How do you like my password?",
	database: "employeeTracker"
});

connection.connect(err => {
	if (err) throw err;
	console.log("Connected!");
});

module.exports = connection;
