var mysql = require('mysql2');

var con = mysql.createConnection({
	host: "localhost",
	user: "user99",
	password: "user99",
	database: "comp7780"
});

con.connect(function(err) {
	if (err) {
		console.log("Database connection failed!");
		console.log("Error Code: " + err.code);
		console.log("Fatal Error: " + err.fatal);
		console.log("Error detail: ");
		console.log(err.errors[0]);
	} else {
		console.log("Connected!");
		con.end();
	}
});
