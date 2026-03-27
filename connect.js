const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
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
