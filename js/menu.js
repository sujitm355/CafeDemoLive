document.addEventListener("DOMContentLoaded", loadMenu);

function loadMenu() {
    const data = menuItems;

    document.getElementById("burgers-list").innerHTML = "";
    document.getElementById("sandwiches-list").innerHTML = "";
    document.getElementById("beverages-list").innerHTML = "";

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    data.forEach(item => {
        const imageUrl = item.imageUrl || "images/Home-page.jpeg";
        const existingItem = cart.find(cartItem => cartItem.itemId === item.itemId);
        const quantity = existingItem ? existingItem.quantity : 0;

        const row = document.createElement("div");
        row.className = "menu-row";

        row.innerHTML = `
            <div class="menu-info">
                <h3>${item.itemName}</h3>
                <p>${item.description || ""}</p>
                <p class="menu-price">Rs. ${item.price}</p>
            </div>

            <div class="menu-action">
                <img src="${imageUrl}" alt="${item.itemName}">
                <div class="qty-box">
                    <button onclick="decreaseQuantity(${item.itemId})">-</button>
                    <span id="qty-${item.itemId}">${quantity}</span>
                    <button onclick="increaseQuantity(${item.itemId}, '${escapeText(item.itemName)}', '${escapeText(item.category)}', '${escapeText(item.description || "")}', ${item.price}, '${imageUrl}')">+</button>
                </div>
            </div>
        `;

        const category = (item.category || "").toLowerCase();

        if (category.includes("burger")) {
            document.getElementById("burgers-list").appendChild(row);
        } else if (category.includes("sandwich") || category.includes("sandwitch")) {
            document.getElementById("sandwiches-list").appendChild(row);
        } else {
            document.getElementById("beverages-list").appendChild(row);
        }
    });
}

function escapeText(text) {
    return String(text).replace(/'/g, "\\'");
}

function increaseQuantity(itemId, itemName, category, description, price, imageUrl) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.itemId === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            itemId,
            itemName,
            category,
            description,
            price,
            imageUrl,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateQuantityDisplay(itemId);
}

function decreaseQuantity(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.itemId === itemId);

    if (existingItem) {
        existingItem.quantity -= 1;

        if (existingItem.quantity <= 0) {
            cart = cart.filter(item => item.itemId !== itemId);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateQuantityDisplay(itemId);
}

function updateQuantityDisplay(itemId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.itemId === itemId);
    const quantity = existingItem ? existingItem.quantity : 0;

    const qtyElement = document.getElementById(`qty-${itemId}`);
    if (qtyElement) {
        qtyElement.innerText = quantity;
    }
}

function goToCart() {
    window.location.href = "cart.html";
}

function goToHome() {
    window.location.href = "index.html";
}