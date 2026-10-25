$(function () {
    // Load recent orders from the Flask API.
    $.get(orderListApiUrl, function (response) {
        var rows = '';
        var totalSales = 0;
        if (response && response.length) {
            $('#orderCount').text(response.length);
            response.slice().reverse().slice(0, 8).forEach(function (order) {
                var total = Number(order.total) || 0;
                totalSales += total;
                rows += '<tr>' +
                    '<td>' + escapeText(formatDate(order.datetime)) + '</td>' +
                    '<td><span class="order-id">#' + escapeText(order.order_id) + '</span></td>' +
                    '<td class="customer-cell">' + escapeText(order.customer_name || 'Walk-in customer') + '</td>' +
                    '<td class="money-cell">₹' + total.toFixed(2) + '</td>' +
                    '<td class="text-right"><button type="button" class="btn btn-xs btn-edit view-order" data-order-id="' + escapeText(order.order_id) + '">View items</button></td></tr>';
            });
            // Calculate total sales across all saved orders, not just the recent ones.
            totalSales = response.reduce(function (sum, order) { return sum + (Number(order.total) || 0); }, 0);
            $('.content-card .store-table tbody').html(rows);
            window.storeOrders = response;
            $('#salesTotal').text('₹' + totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
        } else {
            $('#orderCount').text('0');
            $('.content-card .store-table tbody').html('<tr><td colspan="5" class="empty-state">No orders yet. Create your first order to see it here.</td></tr>');
            $('#salesTotal').text('₹0.00');
        }
    }).fail(function () {
        $('#orderCount').text('—');
        $('.content-card .store-table tbody').html('<tr><td colspan="5" class="empty-state">Could not connect to the store API. Start the Flask backend and check the database connection.</td></tr>');
    });

    $.get(productListApiUrl, function (response) {
        $('#productCount').text(response ? response.length : 0);
    }).fail(function () { $('#productCount').text('—'); });
});

function escapeText(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
}
function formatDate(value) {
    if (!value) return '—';
    var date = new Date(value);
    return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'});
}

$(document).on('click', '.view-order', function () {
    var orderId = String($(this).attr('data-order-id'));
    var order = (window.storeOrders || []).find(function (item) { return String(item.order_id) === orderId; });
    if (!order) return;
    $('#detailCustomer').text((order.customer_name || 'Customer') + ' · Order #' + order.order_id);
    var rows = '';
    (order.order_details || []).forEach(function (item) {
        rows += '<tr><td>' + escapeText(item.product_name || 'Product') + '</td><td>' + escapeText(item.quantity) + '</td><td class="money-cell">₹' + (Number(item.total_price) || 0).toFixed(2) + '</td></tr>';
    });
    if (!rows) rows = '<tr><td colspan="3" class="empty-state">No item details found.</td></tr>';
    $('#orderDetailRows').html(rows);
    $('#detailTotal').text('₹' + (Number(order.total) || 0).toFixed(2));
    $('#orderDetailsModal').modal('show');
});
