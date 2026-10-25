
var productPrices = {};

$(function () {
    // Load products from the DailyBasket Flask backend
    $.ajax({
        url: 'http://127.0.0.1:5000/getProducts',
        method: 'GET',
        dataType: 'json'
    })
    .done(function (response) {
        console.log('Products received:', response);

        var options = '<option value="">Choose product</option>';

        $.each(response || [], function (_, product) {
            options +=
                '<option value="' + product.product_id + '">' +
                safeOrderText(product.name) +
                '</option>';

            productPrices[product.product_id] =
                Number(product.price_per_unit) || 0;
        });

        // Populate all product dropdowns
        $('.cart-product').html(options);

        // Also populate the original template dropdown, if present
        $('.product-box select').html(options);
    })
    .fail(function (xhr, status, error) {
        console.error('Product loading failed:', status, error);
        console.error(xhr.responseText);

        alert(
            'Could not load products. Make sure the Flask backend is running.'
        );
    });

    addOrderRow();

    $('#addMoreButton').on('click', function (event) {
        event.preventDefault();
        addOrderRow();
    });

    $('#saveOrder').on('click', function (event) {
        event.preventDefault();
        saveOrder();
    });
});


// Add a new product row
function addOrderRow() {
    var template = $('.product-box .product-item').first();

    if (!template.length) {
        console.error(
            'Product row template not found. Check the selectors in order.html.'
        );
        return;
    }

    var row = template.clone();

    row.find('select').val('');
    row.find('.product-price').val('0.00');
    row.find('.product-qty').val('1');
    row.find('.product-total').val('0.00');

    $('#itemsInOrder').append(row);

    $('#emptyCartHint').hide();

    updateOrderTotal();
}


// Remove a product row
$(document).on('click', '.remove-row', function (event) {
    event.preventDefault();

    $(this).closest('.product-item').remove();

    if ($('#itemsInOrder .product-item').length === 0) {
        $('#emptyCartHint').show();
    }

    updateOrderTotal();
});


// Update price when a product is selected
$(document).on('change', '.cart-product', function () {
    var productId = $(this).val();
    var price = productPrices[productId] || 0;

    $(this)
        .closest('.product-item')
        .find('.product-price')
        .val(price.toFixed(2));

    updateOrderTotal();
});


// Update total when quantity changes
$(document).on('input change', '.product-qty', function () {
    updateOrderTotal();
});


// Calculate each row total and the grand total
function updateOrderTotal() {
    var grandTotal = 0;

    $('#itemsInOrder .product-item').each(function () {
        var quantity = Math.max(
            0,
            parseFloat($(this).find('.product-qty').val()) || 0
        );

        var price =
            parseFloat($(this).find('.product-price').val()) || 0;

        var lineTotal = price * quantity;

        $(this)
            .find('.product-total')
            .val(lineTotal.toFixed(2));

        grandTotal += lineTotal;
    });

    $('#product_grand_total').val(grandTotal.toFixed(2));
}


// Save the order
function saveOrder() {
    var customerName = $('#customerName').val().trim();

    if (!customerName) {
        alert('Please enter the customer name.');
        $('#customerName').focus();
        return;
    }

    var details = [];
    var invalid = false;

    $('#itemsInOrder .product-item').each(function () {
        var productId = $(this).find('.cart-product').val();

        var quantity = parseInt(
            $(this).find('.product-qty').val(),
            10
        );

        var total = parseFloat(
            $(this).find('.product-total').val()
        ) || 0;

        if (
            !productId ||
            !quantity ||
            quantity < 1
        ) {
            invalid = true;
            return false;
        }

        details.push({
            product_id: productId,
            quantity: quantity,
            total_price: total
        });
    });

    if (invalid || details.length === 0) {
        alert(
            'Choose a product and a valid quantity for every order row. ' +
            'Remove any unused rows.'
        );
        return;
    }

    var payload = {
        customer_name: customerName,
        grand_total: $('#product_grand_total').val(),
        order_details: details
    };

    $('#saveOrder').prop('disabled', true).text('Saving...');

    $.ajax({
        method: 'POST',
        url: orderSaveApiUrl,
        data: {
            data: JSON.stringify(payload)
        }
    })
    .done(function () {
        alert('Order saved successfully!');
        window.location.href = 'index.html';
    })
    .fail(function (xhr, status, error) {
        console.error('Order save failed:', status, error);
        console.error(xhr.responseText);

        alert(
            'Order could not be saved. Check the Flask terminal for errors.'
        );

        $('#saveOrder')
            .prop('disabled', false)
            .html('Save order <span>→</span>');
    });
}


// Safely display product names in HTML
function safeOrderText(value) {
    return String(value == null ? '' : value).replace(
        /[&<>"']/g,
        function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        }
    );
}
