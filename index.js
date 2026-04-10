/*
    index.js
    Entry point for the app.
    To start: node index.js

    Based on teacher's deliverable (cycle3 deliverable/index.js)
    Fixed: syntax error in original (unclosed '/' handler)
    Changed: mysql2, user99 credentials, proper route structure
*/

var express = require('express');
var mysql = require('mysql2');
var path = require('path');

var app = express();

/* define static folders */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Home page */
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'comp7780_home.html'));
});

/* Product page */
app.get('/product', function(req, res) {
    res.sendFile(path.join(__dirname, 'comp7780_product.html'));
});

/* Add to cart — saves item to cart table in MySQL */
app.get('/cart', function(req, res) {
    var responseText = 'Prod_id: ' + req.query.prod_id + '<br>';
    responseText += 'Qty: ' + req.query.qty + '<br>';
    responseText += 'Price: ' + req.query.price + '<br>';
    responseText += 'Username: ' + req.query.f_username + '<br><br>';

    var now = new Date();
    var cur_date_yyyy_mm_dd = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    console.log('cur_date_yyyy_mm_dd is: ' + cur_date_yyyy_mm_dd);

    var con = mysql.createConnection({
        host: 'localhost',
        user: 'user99',
        password: 'user99',
        database: 'comp7780'
    });

    con.connect(function(err) {
        if (err) throw err;
        var sql = 'INSERT INTO cart (cust_username, cart_order_date, prod_id, cart_qty, cart_price) VALUES (' +
            "'" + req.query.f_username + "'," +
            "'" + cur_date_yyyy_mm_dd + "'," +
            req.query.prod_id + ',' +
            req.query.qty + ',' +
            req.query.price + ');';
        console.log(sql);
        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result);
            console.log(result.affectedRows);

            if (result.affectedRows > 0) {
                responseText += 'Thank you for your order! ' + req.query.f_username + '<br>';
                responseText += 'The above item has been added to your shopping cart.<br>';
            } else {
                responseText += 'MySQL ERROR: Item not added!<br>';
            }
            responseText += '<br><br>';
            responseText += '<input type="button" value="Close this page" onclick="self.close();" />';
            res.send(responseText);
        });
        con.end();
    });
});

/* Check out — reads cart, shows order summary with PayPal */
app.get('/check_out', function(req, res) {
    var responseText = '<!DOCTYPE html>';
    responseText += '<head><meta name="viewport" content="width=device-width, initial-scale=1">';
    responseText += '<meta http-equiv="X-UA-Compatible" content="IE=edge" /></head>';
    responseText += '<body><script src="https://www.paypal.com/sdk/js?client-id=ATSWa9vavLRPYABa5DAFOb7d6xFXlYIfpC4eE0ML-fo4wvxD7MhswAQkklI625Mqnbudf6psDaPUC5mj&locale=en_US">';
    responseText += '</script>';

    var con = mysql.createConnection({
        host: 'localhost',
        user: 'user99',
        password: 'user99',
        database: 'comp7780'
    });

    con.connect(function(err) {
        if (err) throw err;
        var sql = "SELECT DATE_FORMAT(cart.cart_order_date, '%Y-%m-%d') AS order_date, ";
        sql += 'cart.prod_id, product.prod_desc, cart.cart_qty, cart.cart_price ';
        sql += 'FROM cart ';
        sql += 'INNER JOIN product ON cart.prod_id = product.prod_id ';
        sql += "WHERE cart.cust_username = '" + req.query.f_check_out_username + "'";
        sql += 'ORDER BY order_date ASC, prod_id DESC;';
        console.log(sql);

        con.query(sql, function(err, result) {
            if (err) throw err;
            console.log(result);
            responseText += 'Thank you for your order! ' + req.query.f_check_out_username + '<br>';
            responseText += 'Your order details:<br><br>';
            responseText += '<table border="2">';
            responseText += '<tr><th>Order Date</th><th>Product ID</th><th>Product</th><th>Qty</th><th>Price</th><th>Amount</th></tr>';

            var total_due = 0;
            var sub_total = 0;
            for (var i = 0; i < result.length; i++) {
                sub_total = result[i].cart_qty * result[i].cart_price;
                responseText += '<tr><td>' + result[i].order_date + '</td>' +
                    '<td>' + result[i].prod_id + '</td>' +
                    '<td>' + result[i].prod_desc + '</td>' +
                    '<td>' + result[i].cart_qty + '</td>' +
                    '<td>' + result[i].cart_price + '</td>' +
                    '<td>' + sub_total.toFixed(2) + '</td></tr>';
                total_due += sub_total;
            }
            responseText += '</table>';
            responseText += '<br>Total Due: ' + total_due.toFixed(2);
            responseText += '<br><br>';

            responseText += '<div id="paypal-button-container"></div>';
            responseText += '<p id="txt1"></p>';
            responseText += '<script>';
            responseText += 'paypal.Buttons({';
            responseText += 'createOrder: function(data, actions) {';
            responseText += 'return actions.order.create({';
            responseText += 'purchase_units: [{';
            responseText += 'amount: {';
            responseText += 'value: ' + total_due.toFixed(2) + '}';
            responseText += '}]';
            responseText += '});';
            responseText += '},';
            responseText += 'onApprove: function(data, actions) {';
            responseText += 'return actions.order.capture().then(function(details) {';
            responseText += 'alert("Transaction completed by " + details.payer.name.given_name);';
            responseText += 'document.querySelector("#txt1").innerHTML = "Payment has completed! This web page can be closed now!";';
            responseText += 'document.querySelector("#txt1").style.backgroundColor = "yellow";';
            responseText += 'document.querySelector("#txt1").style.color = "red";';
            responseText += '});';
            responseText += '}';
            responseText += '}).render("#paypal-button-container");';
            responseText += '<\/script>';
            responseText += '</body></html>';
            res.send(responseText);
        });
        con.end();
    });
});

app.listen(3000, function() {
    console.log('index.js listening to http://127.0.0.1:3000/ or http://localhost:3000/');
});

console.log('End of Program.');
