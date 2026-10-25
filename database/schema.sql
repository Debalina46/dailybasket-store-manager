-- DailyBasket starter schema. Run this in MySQL before starting backend/server.py.
CREATE DATABASE IF NOT EXISTS grocery_store;
USE grocery_store;

CREATE TABLE IF NOT EXISTS uom (
    uom_id INT AUTO_INCREMENT PRIMARY KEY,
    uom_name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    uom_id INT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_products_uom FOREIGN KEY (uom_id) REFERENCES uom(uom_id)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT IGNORE INTO uom (uom_name) VALUES ('kg'), ('gram'), ('litre'), ('piece'), ('packet');
INSERT IGNORE INTO products (name, uom_id, price_per_unit)
SELECT 'Rice', uom_id, 58.00 FROM uom WHERE uom_name = 'kg';
INSERT IGNORE INTO products (name, uom_id, price_per_unit)
SELECT 'Milk', uom_id, 30.00 FROM uom WHERE uom_name = 'litre';
INSERT IGNORE INTO products (name, uom_id, price_per_unit)
SELECT 'Eggs', uom_id, 7.00 FROM uom WHERE uom_name = 'piece';
