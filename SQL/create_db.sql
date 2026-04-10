############################
### Node.js with MySQL use comp7780 database
### hans yip 2022/1/11
### Create comp7780 database for COMp7780 class
### TO RUN this script: 
### 0. start mysql: go to cmd as Administrator, enter 'net start mysql80'
### 1. Logon to MySQL monitor: mysql -uuser99 -p  
### 2. source or \. c:/mysql_workspace/comp7780/22_create_db_table/create_db.sql
### Use user99 to create the database and table, therefore user99 is the owner
### 3. stop mysql: go to cmd as Administrator, enter 'net stop mysql80'
############################

DROP DATABASE comp7780;

CREATE DATABASE comp7780;