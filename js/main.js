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

function logout() {
    localStorage.removeItem("cafeUser");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("staffUser");
    window.location.href = "login.html";
}

function requireLogin() {
    if (!getUser()) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}
