# COMP7780 Cycle 3 — HKBU Campus Bistro Online Ordering System

**Team:** Vitality · Team 3
**Course:** COMP7780, Hong Kong Baptist University

---

## Prerequisites

Make sure the following are installed before running:

- [Node.js](https://nodejs.org/) (v16 or above)
- [MySQL Server 8.0](https://dev.mysql.com/downloads/mysql/)

---

## Step 1 — Set Up the Database

Open a terminal and log in to MySQL:

```bash
# Mac/Linux
mysql -u root -p

# Windows PowerShell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

Then run the following SQL commands:

```sql
CREATE DATABASE IF NOT EXISTS comp7780;

USE comp7780;

CREATE TABLE IF NOT EXISTS orders (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT NOT NULL DEFAULT 0,
    identity       VARCHAR(100),
    product_name   VARCHAR(100),
    quantity       INT,
    price          DECIMAL(10,2),
    total          DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'Paid',
    order_time     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **MySQL 8.0 authentication fix** — if `node connect.js` fails with auth error, run:
> ```sql
> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
> FLUSH PRIVILEGES;
> ```

---

## Step 2 — Configure Database Password

Open both `connect.js` and `index.js`, update the `password` field to match your MySQL root password:

```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_PASSWORD_HERE',   // <-- change this
    database: 'comp7780'
});
```

---

## Step 3 — Install Dependencies

In the `cycle3` directory, run:

```bash
npm install
```

---

## Step 4 — Test Database Connection

```bash
node connect.js
```

Expected output:
```
Connected!
```

---

## Step 5 — Start the Server

```bash
node index.js
```

Expected output:
```
Server running at http://localhost:3000/
Connected to MySQL database.
```

---

## Step 6 — Use the Application

Open a browser and visit:

| URL | Page |
|-----|------|
| `http://localhost:3000/` | Home page |
| `http://localhost:3000/product` | Menu & ordering page |

**To place an order:**
1. Go to `http://localhost:3000/product`
2. Select a Guest Identity: **VIP / Standard / Faculty**
3. Set quantities and click **Order Dish** to add items to cart
4. Click **Request Bill** to review the order summary
5. Click the **PayPal button** to complete payment via PayPal sandbox
6. After payment approval, the order is saved to MySQL and an **Order ID** is displayed

> PayPal sandbox test account credentials can be found at [developer.paypal.com](https://developer.paypal.com) → Testing Tools → Sandbox Accounts

---

## Step 7 — View Orders in Database

**Option A — Formatted output (recommended):**

```bash
node view_orders.js
```

Shows each order grouped by Order ID, with items, totals, payment status, and a separator between orders.

**Option B — Raw table (Windows PowerShell):**

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p123456 -e "USE comp7780; SELECT * FROM orders;"
```

**To clear all orders:**

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p123456 -e "USE comp7780; TRUNCATE TABLE orders;"
```

---

## Project Structure

```
cycle3/
├── index.js                  # Express server with MySQL + PayPal routes
├── connect.js                # Database connection test
├── view_orders.js            # Formatted order viewer (grouped by order_id)
├── comp7780_home.html        # Home page
├── comp7780_product.html     # Menu, cart, PayPal payment page
├── package.json
└── public/                   # Static assets
    ├── Beef.jpg
    ├── Braised.jpeg
    ├── CF.png
    ├── bbq.jpg
    ├── cooking.mp4
    ├── cs_logo.png
    ├── enews1.jpg
    └── logo.png
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Serve home page |
| GET | `/product` | Serve menu & ordering page |
| POST | `/order` | Save order to MySQL after PayPal payment, returns `{ success, orderId }` |

**POST `/order` request body (JSON):**
```json
{
  "customer": "VIP",
  "items": [
    { "name": "Hakka Braised Pork", "quantity": 2, "price": 66 },
    { "name": "Wok-Fried Beef", "quantity": 1, "price": 78 }
  ]
}
```

---

## Database Schema

| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Row primary key |
| order_id | INT | Groups all items from one order |
| identity | VARCHAR | VIP / Standard / Faculty |
| product_name | VARCHAR | Name of the dish |
| quantity | INT | Number of portions |
| price | DECIMAL | Unit price |
| total | DECIMAL | quantity × price |
| payment_status | VARCHAR | Always `Paid` (written only after PayPal approval) |
| order_time | TIMESTAMP | Time of order |
