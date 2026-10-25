

from flask import Flask, request, jsonify
from sql_connection import get_sql_connection
import json

import products_dao
import orders_dao
import uom_dao

app = Flask(__name__)


# Allow the frontend to communicate with the Flask API
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response


# Get all units of measurement
@app.route('/getUOM', methods=['GET'])
def get_uom():
    connection = get_sql_connection()
    try:
        response = uom_dao.get_uoms(connection)
        return jsonify(response)
    finally:
        connection.close()


# Get all products
@app.route('/getProducts', methods=['GET'])
def get_products():
    connection = get_sql_connection()
    try:
        response = products_dao.get_all_products(connection)
        return jsonify(response)
    finally:
        connection.close()


# Insert a new product
@app.route('/insertProduct', methods=['POST'])
def insert_product():
    try:
        request_payload = json.loads(request.form['data'])
    except (KeyError, ValueError):
        return jsonify({'error': 'Invalid product data'}), 400

    if (
        not request_payload.get('product_name')
        or not request_payload.get('uom_id')
        or float(request_payload.get('price_per_unit', 0)) <= 0
    ):
        return jsonify({
            'error': 'Product name, unit and a positive price are required.'
        }), 400

    connection = get_sql_connection()
    try:
        product_id = products_dao.insert_new_product(
            connection, request_payload
        )
        return jsonify({'product_id': product_id})
    finally:
        connection.close()


# Get all orders
@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    connection = get_sql_connection()
    try:
        response = orders_dao.get_all_orders(connection)
        return jsonify(response)
    finally:
        connection.close()


# Insert a new order
@app.route('/insertOrder', methods=['POST'])
def insert_order():
    try:
        request_payload = json.loads(request.form['data'])
    except (KeyError, ValueError):
        return jsonify({'error': 'Invalid order data'}), 400

    connection = get_sql_connection()
    try:
        order_id = orders_dao.insert_order(connection, request_payload)
        return jsonify({'order_id': order_id})
    finally:
        connection.close()


# Get details for one order
@app.route('/getOrderDetails', methods=['GET'])
def get_order_details():
    order_id = request.args.get('order_id')

    if not order_id:
        return jsonify({'error': 'order_id is required'}), 400

    connection = get_sql_connection()
    try:
        response = orders_dao.get_order_details(connection, order_id)
        return jsonify(response)
    finally:
        connection.close()


if __name__ == '__main__':
    print(
        'Starting Python Flask Server For Grocery Store Management System'
    )
    app.run(host='127.0.0.1', port=5000, debug=False)
