function selectOrderType(orderType) {
    localStorage.setItem("orderType", orderType);
    window.location.href = "menu.html";
}

function goToBookingPage() {
    window.location.href = "booking.html";
}

function getUser() {
    const user = localStorage.getItem("cafeUser");
    return user ? JSON.parse(user) : null;
}

function setUser(user) {
    localStorage.setItem("cafeUser", JSON.stringify(user));
}

function loadStaffOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const table = document.getElementById("staffOrdersTable");

    if (!table) return;

    if (orders.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5">No orders available.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = orders.map(order => `
        <tr>
            <td>${order.orderNumber || "-"}</td>
            <td>${order.customerName || "-"}</td>
            <td>${order.phone || "-"}</td>
            <td>Rs. ${Number(order.totalAmount || 0).toFixed(2)}</td>
            <td>
                <select onchange="updateOrderStatus('${order.orderNumber}', this.value)">
                    <option value="PLACED" ${order.orderStatus === "PLACED" ? "selected" : ""}>PLACED</option>
                    <option value="PREPARING" ${order.orderStatus === "PREPARING" ? "selected" : ""}>PREPARING</option>
                    <option value="OUT_FOR_DELIVERY" ${order.orderStatus === "OUT_FOR_DELIVERY" ? "selected" : ""}>OUT FOR DELIVERY</option>
                    <option value="DELIVERED" ${order.orderStatus === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
                </select>
            </td>
        </tr>
    `).join("");
}

function updateOrderStatus(orderNumber, status) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders = orders.map(order => {
        if (order.orderNumber === orderNumber) {
            order.orderStatus = status;
        }
        return order;
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order status updated successfully.");

    loadStaffOrders();
}



function logout() {
    localStorage.removeItem("staffUser");
    window.location.href = "login.html";
}

loadMenu();
loadStaffOrders();


function requireLogin() {
    if (!getUser()) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}
