const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'comp7780'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'comp7780_home.html'));
});

// Product page
app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'comp7780_product.html'));
});

// Place order — insert each item as a row with a shared order_id
app.post('/order', (req, res) => {
    const { customer, items } = req.body;

    if (!customer || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid order data.' });
    }

    // Get current max order_id, then use max+1 as the new order_id
    db.query('SELECT IFNULL(MAX(order_id), 0) AS maxId FROM orders', (err, rows) => {
        if (err) {
            console.error('Query failed:', err.message);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }

        const newOrderId = rows[0].maxId + 1;

        const values = items.map(item => [
            newOrderId,
            customer,
            item.name,
            item.quantity,
            item.price,
            item.quantity * item.price
        ]);

        const sql = 'INSERT INTO orders (order_id, identity, product_name, quantity, price, total) VALUES ?';

        db.query(sql, [values], (err) => {
            if (err) {
                console.error('Insert failed:', err.message);
                return res.status(500).json({ success: false, message: 'Database error.' });
            }
            res.json({ success: true, orderId: newOrderId });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:3000/`);
});
