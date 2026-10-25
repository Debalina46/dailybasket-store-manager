// Define your api here

var productListApiUrl = 'http://127.0.0.1:5000/getProducts';
var uomListApiUrl = 'http://127.0.0.1:5000/getUOM';
var productSaveApiUrl = 'http://127.0.0.1:5000/insertProduct';
var productUpdateApiUrl = 'http://127.0.0.1:5000/updateProduct';
var productDeleteApiUrl = 'http://127.0.0.1:5000/deleteProduct';

var orderListApiUrl = 'http://127.0.0.1:5000/getAllOrders';
var orderSaveApiUrl = 'http://127.0.0.1:5000/insertOrder';

// Use the DailyBasket backend for product selection
var productsApiUrl = 'http://127.0.0.1:5000/getProducts';

function callApi(method, url, data) {
    $.ajax({
        method: method,
        url: url,
        data: data
    })
    .done(function (response) {
        window.location.reload();
    })
    .fail(function (xhr) {
        console.error('API request failed:', url, xhr.status, xhr.responseText);
        alert('Request failed. Please check the backend and try again.');
    });
}

function calculateValue() {
    var total = 0;

    $('.product-item').each(function () {
        var qty = parseFloat($(this).find('.product-qty').val()) || 0;
        var price = parseFloat($(this).find('#product_price').val()) || 0;

        var itemTotal = price * qty;

        $(this).find('#item_total').val(itemTotal.toFixed(2));
        total += itemTotal;
    });

    $('#product_grand_total').val(total.toFixed(2));
}

function orderParser(order) {
    return {
        id: order.order_id,
        date: order.datetime,
        orderNo: order.order_id,
        customerName: order.customer_name,
        cost: parseFloat(order.total) || 0
    };
}

function productParser(product) {
    return {
        id: product.product_id,
        name: product.name,
        unit: product.uom_name,
        price: parseFloat(product.price_per_unit) || 0
    };
}

function productDropParser(product) {
    return {
        id: product.product_id,
        name: product.name
    };
}

// Enable Bootstrap tooltips globally if needed
// $(function () {
//     $('[data-toggle="tooltip"]').tooltip();
// });
