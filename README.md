# DailyBasket — Local Grocery Store Manager

DailyBasket is a small store-management web application designed around the everyday needs of a neighbourhood grocery shop. It brings a product catalogue, customer orders and a sales overview into one simple workspace.

## Features

- **Store dashboard:** order count, product count, total recorded sales and recent orders.
- **Order details:** view the products, quantities and line totals in a saved order.
- **Product catalogue:** add, search, edit and remove products.
- **Order billing:** add multiple products, calculate line totals and grand total automatically, and validate customer/product/quantity fields.
- **Three-tier structure:** HTML/CSS/JavaScript + Bootstrap frontend, Python Flask API and MySQL database.
- **Responsive layout:** usable on desktop and smaller screens.

## Technology stack

- Frontend: HTML, CSS, JavaScript, jQuery and Bootstrap
- Backend: Python and Flask
- Database: MySQL

## Run locally on Windows

### 1. Set up the database

Install MySQL Server, then run `database/schema.sql` in MySQL Workbench. It creates the `grocery_store` database, the required tables, and a few sample units/products. The DAO queries expect these columns:

- `uom`: `uom_id`, `uom_name`
- `products`: `product_id`, `name`, `uom_id`, `price_per_unit`
- `orders`: `order_id`, `customer_name`, `total`, `datetime`
- `order_details`: `order_id`, `product_id`, `quantity`, `total_price`

Update `backend/sql_connection.py` with your own local MySQL username, password and database. Do not commit real database credentials to a public repository.

### 2. Install backend dependencies

Open a terminal in the project folder and run:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install flask mysql-connector-python
```

### 3. Start the Flask API

```bash
cd backend
python server.py
```

The API runs at `http://127.0.0.1:5000`.

### 4. Open the frontend

Open `ui/index.html` in your browser, or use the VS Code Live Server extension to serve the `ui` folder. Keep the backend terminal running. The UI calls the API at `http://127.0.0.1:5000`.

## Project walkthrough for interviews

A simple explanation:

> “I built DailyBasket as a practical store-management solution for a neighbourhood grocery shop. Small stores often need a straightforward way to maintain product prices and record customer purchases. I created a dashboard for sales visibility, a product catalogue with search and edit options, and an order screen that calculates totals and validates entries. The frontend communicates with a Flask API, which reads and writes the records in MySQL. I kept the code separated into UI, API routes and DAO/database functions so each part is easier to understand and maintain.”

Only describe it as deployed or actively used by a real shop if that is true. If it is a prototype, say it was **designed for the needs of a local store** and explain what you would validate with the shop owner before real deployment.

## Possible next improvements

- Add user login and role-based access for owner/staff.
- Add stock quantity and low-stock alerts.
- Add date filters and downloadable sales reports.
- Move database credentials to environment variables and add automated tests.
