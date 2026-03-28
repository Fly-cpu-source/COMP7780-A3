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

        const sep    = '+----------+----------+------------------------+----------+--------+--------+---------+-------------------------+------------------------+';
        const header = '| order_id | identity | product_name           | quantity |  price |  total | status  | order_time (HKT)        | order summary          |';

        // Group rows by order_id
        const groups = {};
        rows.forEach(r => {
            if (!groups[r.order_id]) groups[r.order_id] = [];
            groups[r.order_id].push(r);
        });

        console.log(sep);
        console.log(header);
        console.log(sep);

        Object.values(groups).forEach((items) => {
            const orderTotal = items.reduce((sum, r) => sum + Number(r.total), 0);
            const status = items[0].payment_status || 'Paid';
            const summaryText = `$${orderTotal.toFixed(2)} [${status}]`;
            const totalWidth = 22;
            const padLeft = Math.floor((totalWidth - summaryText.length) / 2);
            const padRight = totalWidth - summaryText.length - padLeft;
            const midIndex = Math.floor((items.length - 1) / 2);

            items.forEach((r, i) => {
                const isMid    = i === midIndex;
                const orderId  = isMid ? String(r.order_id).padStart(8) : '        ';
                const identity = isMid ? r.identity.padEnd(8)           : '        ';
                const name     = r.product_name.padEnd(22);
                const qty      = String(r.quantity).padStart(8);
                const price    = Number(r.price).toFixed(2).padStart(6);
                const total    = Number(r.total).toFixed(2).padStart(6);
                const st       = isMid ? (r.payment_status || 'Paid').padEnd(7) : '       ';
                const hkTime   = new Date(r.order_time.getTime() + 8 * 60 * 60 * 1000);
                const time     = isMid ? hkTime.toISOString().replace('T',' ').slice(0,19) + ' HKT' : '                       ';
                const summary  = isMid
                    ? `${' '.repeat(padLeft)}${summaryText}${' '.repeat(padRight)}`
                    : '                      ';
                console.log(`| ${orderId} | ${identity} | ${name} | ${qty} | ${price} | ${total} | ${st} | ${time} | ${summary} |`);
            });
            console.log(sep);
        });
    });
});
