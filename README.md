# COMP7780 Assignment 2 — Cycle 3
**Team:** Vitality · Team 3

| No. | Name | Student ID | Role |
|-----|------|-----------|------|
| 1 | YANG Yanhang | 25409220 | Project Manager |
| 2 | WU Feiyang | 25418491 | Developer |
| 3 | ZHU Zhaoting | 25443631 | Developer |
| 4 | ZHANG Xingjian | 25401556 | Analyst |
| 5 | LI Cuijie | 25434837 | Analyst |
| 6 | CHEN Hongshen | 25450913 | Tester |

---

## Prerequisites

Make sure the following are installed on your machine before running:

- [Node.js](https://nodejs.org/) (v18 or above)
- MySQL 8.0

---

## Step 1 — Start MySQL

Open **CMD as Administrator** and start the MySQL service.

First, check your MySQL service name:
```
sc query type= service state= all | findstr /i mysql
```

Then start it using your service name (e.g. `MySQL80`, `MySQL`, etc.):
```
net start <your_mysql_service_name>
```

---

## Step 2 — Set Up the Database

Log in to MySQL as root and run the two SQL scripts provided in the `cycle3_db` folder:

**2a. Create user99:**
```
mysql -u root -p
source path/to/cycle3_db/11_create_user/create_user.sql
```

This creates a database user `user99` with password `user99`.

**2b. Create tables and insert sample data:**
```
use comp7780;
source path/to/cycle3_db/22_create_db_table/create_tables.sql
```

This creates all required tables (`customer`, `product`, `cart`, `sales_order`, `order_detail`, etc.) and inserts sample data.

---

## Step 3 — Test Database Connection

In the `cycle3` folder, run:

```
node connect.js
```

Expected output:
```
Connected!
```

This confirms Node.js can successfully connect to MySQL using `user99`.

---

## Step 4 — Install Dependencies

In the `cycle3` folder, run:

```
npm install
```

Expected output:
```
added 76 packages, and audited 77 packages in 774ms
found 0 vulnerabilities
```

This installs `express` and `mysql2` along with all their dependencies into the `node_modules` folder.

---

## Step 5 — Start the Server

```
node index.js
```

Expected output:
```
End of Program.
index.js listening to http://127.0.0.1:3000/ or http://localhost:3000/
```

---

## Step 6 — Open in Browser

Visit the following URLs:

| Page | URL |
|------|-----|
| Home page | http://localhost:3000/ |
| Product page | http://localhost:3000/product |

---

## Step 7 — Place an Order (Test Flow)

1. Go to `http://localhost:3000/product`
2. Select a customer from the dropdown (Customer1 – Customer4)
3. Set quantity and click **Order Dish** for any item
   - This triggers `GET /cart` and saves the item to the `cart` table in MySQL
4. Click **Request Bill** to review the order summary
5. Click **Proceed to PayPal** to go to the checkout page
   - The page displays all cart items for the selected customer, calculates the total, and renders a PayPal payment button
6. Complete payment via PayPal sandbox

---

## Step 8 — Verify Data in MySQL

```
mysql -u user99 -puser99 -e "USE comp7780; SELECT * FROM cart;"
```

You should see the order records written by the application.

---

## Project Structure

```
cycle3/
├── index.js                  # Express server — routes: /, /product, /cart, /check_out
├── connect.js                # Database connection test
├── comp7780_home.html        # Home page
├── comp7780_product.html     # Product & ordering page
├── package.json              # Project dependencies (express, mysql2)
├── package-lock.json         # Dependency lock file
└── public/                   # Static assets (images, video)
    ├── cooking.mp4
    ├── logo.png
    ├── cs_logo.png
    ├── enews1.jpg
    ├── CF.png
    ├── Braised.jpeg
    ├── bbq.jpg
    └── Beef.jpg
```

---

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Serves the home page |
| GET | `/product` | Serves the product & ordering page |
| GET | `/cart` | Inserts selected item into MySQL `cart` table |
| GET | `/check_out` | Reads cart, displays order summary with PayPal button |

---

## Database

- **Host:** localhost
- **Database:** comp7780
- **User:** user99
- **Password:** user99
