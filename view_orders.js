const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'comp7780'
});

db.connect((err) => {
    if (err) { console.error('Connection failed:', err.message); return; }

    db.query('SELECT * FROM orders ORDER BY order_id, id', (err, rows) => {
        db.end();
        if (err) { console.error('Query failed:', err.message); return; }
        if (rows.length === 0) { console.log('No orders yet.'); return; }

        const sep = '+----------+----------+------------------------+----------+--------+--------+---------------------+';
        const header = '| order_id | identity | product_name           | quantity |  price |  total | order_time          |';

        // Group rows by order_id
        const groups = {};
        rows.forEach(r => {
            if (!groups[r.order_id]) groups[r.order_id] = [];
            groups[r.order_id].push(r);
        });

        console.log(sep);
        console.log(header);
        console.log(sep);

        Object.values(groups).forEach((items, groupIndex) => {
            let orderTotal = 0;
            items.forEach((r, i) => {
                const orderId  = i === 0 ? String(r.order_id).padStart(8)  : '        ';
                const identity = i === 0 ? r.identity.padEnd(8)            : '        ';
                const name     = r.product_name.padEnd(22);
                const qty      = String(r.quantity).padStart(8);
                const price    = Number(r.price).toFixed(2).padStart(6);
                const total    = Number(r.total).toFixed(2).padStart(6);
                const time     = i === 0 ? r.order_time.toISOString().replace('T',' ').slice(0,19) : '                   ';
                console.log(`| ${orderId} | ${identity} | ${name} | ${qty} | ${price} | ${total} | ${time} |`);
                orderTotal += Number(r.total);
            });
            // Total row
            const totalStr = `ORDER TOTAL: $${orderTotal.toFixed(2)}`;
            console.log(`| ${totalStr.padEnd(sep.length - 4)} |`);
            console.log(sep);
        });
    });
});
