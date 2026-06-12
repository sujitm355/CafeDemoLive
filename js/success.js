document.addEventListener("DOMContentLoaded", function () {
    const orderType = localStorage.getItem("orderType");
    const orderNumberValue = localStorage.getItem("savedOrderNumber");

    const successMessage = document.getElementById("success-message");
    const orderNumber = document.getElementById("order-number");

    if (orderType === "DRIVE_THRU") {
        successMessage.innerText = "Please collect your order at the collection window.";
    } else if (orderType === "ONLINE") {
        successMessage.innerText = "Your food will be delivered shortly.";
    } else {
        successMessage.innerText = "Your order has been placed successfully.";
    }

    orderNumber.innerText = "Order ID: " + (orderNumberValue || "Not Available");
});

function goToHome() {
    localStorage.removeItem("cart");
    localStorage.removeItem("customerDetails");
    localStorage.removeItem("paymentDetails");
    localStorage.removeItem("savedOrderNumber");
    localStorage.removeItem("orderType");

    window.location.href = "index.html";
}