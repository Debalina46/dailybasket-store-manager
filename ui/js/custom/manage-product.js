var productModal = $('#productModal');
var productsCache = [];

$(function () {
    loadProducts();
    productModal.on('show.bs.modal', function () { if ($('#id').val() === '0') loadUnits(); });
    productModal.on('hidden.bs.modal', function () {
        $('#productForm')[0].reset();
        $('#id').val('0');
        productModal.find('.modal-title').text('Add a product');
    });

    $('#productSearch').on('input', function () {
        renderProducts($(this).val());
    });

    $('#saveProduct').on('click', function () {
        var form = $('#productForm')[0];
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var requestPayload = {
            product_name: $('#name').val().trim(),
            uom_id: $('#uoms').val(),
            price_per_unit: $('#price').val()
        };
        if (!requestPayload.product_name || Number(requestPayload.price_per_unit) <= 0) {
            alert('Please enter a product name and a price greater than zero.');
            return;
        }
        var productId = $('#id').val();
        if (productId && productId !== '0') requestPayload.product_id = productId;
        callApi('POST', productId && productId !== '0' ? productUpdateApiUrl : productSaveApiUrl, {'data': JSON.stringify(requestPayload)});
    });

    $(document).on('click', '.edit-product', function () {
        var row = $(this).closest('tr');
        var product = productsCache.find(function (item) { return String(item.product_id) === String(row.attr('data-id')); });
        if (!product) return;
        $('#id').val(product.product_id);
        $('#name').val(product.name);
        $('#price').val(product.price_per_unit);
        productModal.find('.modal-title').text('Edit product');
        loadUnits(function () { $('#uoms').val(String(product.uom_id)); });
        productModal.modal('show');
    });

    $(document).on('click', '.delete-product', function () {
        var row = $(this).closest('tr');
        if (confirm('Remove "' + row.attr('data-name') + '" from the catalogue?')) {
            callApi('POST', productDeleteApiUrl, {product_id: row.attr('data-id')});
        }
    });
});

function loadProducts() {
    $.get(productListApiUrl, function (response) {
        productsCache = response || [];
        renderProducts($('#productSearch').val() || '');
        $('#productTotalLabel').text(productsCache.length + (productsCache.length === 1 ? ' product' : ' products'));
    }).fail(function () {
        $('.store-table tbody').html('<tr><td colspan="4" class="empty-state">Could not load products. Start the Flask backend and check the database connection.</td></tr>');
    });
}
function renderProducts(search) {
    var filtered = productsCache.filter(function (product) {
        return String(product.name || '').toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    var rows = '';
    filtered.forEach(function (product) {
        rows += '<tr data-id="' + safe(product.product_id) + '" data-name="' + safe(product.name) + '">' +
            '<td><div class="customer-cell">' + safe(product.name) + '</div></td>' +
            '<td><span class="unit-chip">' + safe(product.uom_name) + '</span></td>' +
            '<td><strong>₹' + (Number(product.price_per_unit) || 0).toFixed(2) + '</strong></td>' +
            '<td class="text-right action-buttons"><button type="button" class="btn btn-xs btn-edit edit-product">Edit</button> <button type="button" class="btn btn-xs btn-danger delete-product">Remove</button></td></tr>';
    });
    if (!rows) rows = '<tr><td colspan="4" class="empty-state">' + (search ? 'No products match your search.' : 'No products yet. Add your first product to get started.') + '</td></tr>';
    $('.store-table tbody').html(rows);
}
function loadUnits(callback) {
    $.get(uomListApiUrl, function (response) {
        var options = '<option value="">Choose a unit</option>';
        $.each(response || [], function (_, unit) {
            options += '<option value="' + safe(unit.uom_id) + '">' + safe(unit.uom_name) + '</option>';
        });
        $('#uoms').html(options);
        if (callback) callback();
    }).fail(function () { alert('Could not load units. Check the Flask backend.'); });
}
function safe(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
}
