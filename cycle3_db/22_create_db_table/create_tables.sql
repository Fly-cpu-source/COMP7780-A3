############################
### Node.js with MySQL use comp7780 database
### hans yip 2022/1/11
### Create tables for comp7780 class
### TO RUN this script: 
### 0. start mysql: go to cmd as Administrator, enter 'net start mysql80'
### 1. Logon to MySQL monitor: mysql -u user99 -p  
### 2. use comp7780
### 3. source or \. c:/mysql_workspace/comp7780/22_create_db_table/create_tables.sql
### 4. stop mysql: go to cmd as Administrator, enter 'net stop mysql80'
############################

use comp7780;

#################################
### create HR: employee table
### 
#################################

DROP TABLE employee;

CREATE TABLE employee (
empl_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
empl_name VARCHAR(20) NOT NULL,
empl_email VARCHAR(20) NOT NULL,
empl_phone varchar(12),
empl_hire_date date,
empl_salary FLOAT NOT NULL
);

desc employee;

INSERT INTO employee VALUES (null, 'empl1', 'empl1@abc.com', '415-123-4567', '2020-01-01', 5000),
(null, 'empl2', 'empl2@abc.com', '415-234-5678', '2020-06-01', 6000),
(null, 'empl3', 'empl3@abc.com', '415-345-6789', '2021-02-01', 5000),
(null, 'empl4', 'empl4@abc.com', '415-456-7890', '2021-05-01', 5000);

#################################
### create Sales: customer, item, cart, supplier, po tables
### 
#################################

DROP TABLE customer;

CREATE TABLE customer (
cust_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
cust_username VARCHAR(20) NOT NULL,
cust_password VARCHAR(64),
cust_email VARCHAR(20) NOT NULL,
cust_name VARCHAR(20) NOT NULL,
cust_phone varchar(12),
cust_credit_limit FLOAT NOT NULL
);

desc customer;

INSERT INTO customer VALUES (null, 'cust1', null, 'cust1@xyz.com', 'Cust1', '415-123-4567', 5000),
(null, 'cust2', null, 'cust2@xyz.com', 'Cust2', '415-234-5678', 6000),
(null, 'cust3', null, 'cust3@xyz.com', 'Cust3', '415-345-6789', 5000),
(null, 'cust4', null, 'cust4@xyz.com', 'Cust4', '415-456-7890', 5000);

DROP TABLE product;

CREATE TABLE product (
prod_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
prod_desc VARCHAR(20) NOT NULL,
prod_on_hand INT NOT NULL,
supplier_id INT NOT NULL
);

desc product;

INSERT INTO product VALUES (null, 'Prod1', 12, 1),
(null, 'Prod2', 6, 1),
(null, 'Prod3', 8, 2),
(null, 'Prod4', 5, 2);

DROP TABLE supplier;

CREATE TABLE supplier (
supplier_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
supplier_name VARCHAR(20) NOT NULL,
supplier_email VARCHAR(20) NOT NULL
);

desc supplier;

INSERT INTO supplier VALUES (null, 'Supplier1', 'supplier1@aaa.com'),
(null, 'Supplier2', 'supplier2@bbb.com');

DROP TABLE cart;

CREATE TABLE cart (
cust_username VARCHAR(20) NOT NULL,
cart_order_date date,
prod_id INT NOT NULL,
cart_qty INT NOT NULL,
cart_price FLOAT NOT NULL
);

desc cart;

DROP TABLE sales_order;

CREATE TABLE sales_order (
order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
cust_username VARCHAR(20) NOT NULL,
order_date date
);

desc sales_order;

DROP TABLE order_detail;

CREATE TABLE order_detail (
order_id INT NOT NULL,
prod_id INT NOT NULL,
qty INT NOT NULL,
price FLOAT NOT NULL
);

desc order_detail;

###################################
### po: po_num, po_date, prod_id, supplier_id 
###
###################################

DROP TABLE po;

CREATE TABLE po (
po_num INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
po_date date,
prod_id INT NOT NULL,
supplier_id INT NOT NULL
);

#################################
### create warehouse: pick_list, invoice tables
### 
#################################

