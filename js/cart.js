document.addEventListener("DOMContentLoaded", loadCart);

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-container");

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML =
            `<div class="empty-cart">Your cart is empty.</div>`;
        return;
    }

    let totalAmount = 0;

    const rows = cart.map(item => {
        const subtotal = item.price * item.quantity;
        totalAmount += subtotal;

        return `
            <tr>
                <td><img src="${item.imageUrl}" alt="${item.itemName}"></td>

                <td>
                    <strong>${item.itemName}</strong><br>
                    <small>${item.description || ""}</small>
                </td>

                <td>Rs. ${item.price}</td>

                <td>
                    <div class="qty-box">
                        <button onclick="decreaseCartQuantity(${item.itemId})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseCartQuantity(${item.itemId})">+</button>
                        <button class="delete-btn" onclick="removeCartItem(${item.itemId})">🗑</button>
                    </div>
                </td>

                <td>Rs. ${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }).join("");

    cartContainer.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>

            <tbody>
                ${rows}

                <tr style="background:#f5f0eb;font-weight:bold;">
                    <td colspan="4" style="text-align:right;font-size:22px;">
                        Grand Total
                    </td>

                    <td style="font-size:22px;">
                        Rs. ${totalAmount.toFixed(2)}
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function increaseCartQuantity(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(cartItem => cartItem.itemId === itemId);

    if (item) {
        item.quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function decreaseCartQuantity(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(cartItem => cartItem.itemId === itemId);

    if (item) {
        item.quantity -= 1;

        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.itemId !== itemId);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.itemId !== itemId);

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function goToMenu() {
    window.location.href = "menu.html";
}

function goToHome() {
    window.location.href = "index.html";
}

function goToDelivery() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderType = localStorage.getItem("orderType");

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    if (orderType && orderType.toLowerCase() === "online") {
        window.location.href = "delivery.html";
    } else {
        window.location.href = "payment.html";
    }
}