const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user99',
    password: 'user99',
    database: 'comp7780'
});

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err.message);
        return;
    }
    console.log('Connected!');
    connection.end();
});
