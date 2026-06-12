let discountAmount = 0;
let originalTotalAmount = 0;
let finalTotalAmount = 0;

const coupons = {
    "WELCOME50": { type: "PERCENT", value: 50 },
    "SAVE100": { type: "FLAT", value: 100 },
    "CAFE200": { type: "FLAT", value: 200 },
    "BURGER25": { type: "PERCENT", value: 25 },
    "FIRST100": { type: "FLAT", value: 100 },
    "SUJIT50": { type: "PERCENT", value: 50 }
};

document.addEventListener("DOMContentLoaded", function () {
    loadPaymentSummary();
    setupPaymentMethodToggle();
    updateCashLabel();
    setupPaymentForm();
});

function loadPaymentSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const summaryContainer = document.getElementById("payment-summary-items");
    const totalElement = document.getElementById("payment-total");

    if (!summaryContainer || !totalElement) return;

    summaryContainer.innerHTML = "";
    originalTotalAmount = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        originalTotalAmount += itemTotal;

        const summaryItem = document.createElement("div");
        summaryItem.className = "summary-item";
        summaryItem.innerHTML = `
            <span>${item.itemName} x ${item.quantity}</span>
            <span>₹${itemTotal}</span>
        `;
        summaryContainer.appendChild(summaryItem);
    });

    finalTotalAmount = originalTotalAmount;
    totalElement.innerText = `₹${finalTotalAmount.toFixed(2)}`;
}

function applyCoupon() {
    const code = document.getElementById("couponCode").value.trim().toUpperCase();
    const couponMessage = document.getElementById("couponMessage");
    const totalElement = document.getElementById("payment-total");

    if (!code) {
        couponMessage.style.color = "red";
        couponMessage.innerHTML = "❌ Please enter a coupon code.";
        return;
    }

    const coupon = coupons[code];

    if (!coupon) {
        couponMessage.style.color = "red";
        couponMessage.innerHTML = "❌ Invalid Coupon Code.";
        return;
    }

    if (coupon.type === "PERCENT") {
        discountAmount = (originalTotalAmount * coupon.value) / 100;
    } else {
        discountAmount = coupon.value;
    }

    finalTotalAmount = originalTotalAmount - discountAmount;

    if (finalTotalAmount < 0) {
        finalTotalAmount = 0;
    }

    totalElement.innerText = `₹${finalTotalAmount.toFixed(2)}`;

    couponMessage.style.color = "green";
    couponMessage.innerHTML =
        `✅ Coupon Applied! You saved ₹${discountAmount.toFixed(2)}`;

    alert(
        "🎉 Congratulations!\n\n" +
        "You saved ₹" + discountAmount.toFixed(2) +
        " by using this coupon! 🥳"
    );
}

function setupPaymentMethodToggle() {
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    const cardSection = document.getElementById("cardDetailsSection");
    const upiSection = document.getElementById("upiDetailsSection");

    paymentOptions.forEach(option => {
        option.addEventListener("change", function () {
            if (this.value === "CARD") {
                cardSection.classList.remove("hidden");
                upiSection.classList.add("hidden");
            } else if (this.value === "UPI") {
                upiSection.classList.remove("hidden");
                cardSection.classList.add("hidden");
            } else {
                cardSection.classList.add("hidden");
                upiSection.classList.add("hidden");
            }
        });
    });
}

function updateCashLabel() {
    const orderType = localStorage.getItem("orderType");
    const label = document.getElementById("cash-option-label");

    if (!label) return;

    if (orderType && orderType.toUpperCase() === "ONLINE") {
        label.innerText = "Cash on Delivery";
    } else {
        label.innerText = "Pay at Counter";
    }
}

function setupPaymentForm() {
    const paymentForm = document.getElementById("paymentForm");

    if (!paymentForm) return;

    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');

        if (!selectedMethod) {
            alert("Please select a payment method.");
            return;
        }

        const paymentMethod = selectedMethod.value;

        if (paymentMethod === "CARD") {
            const cardNumber = document.getElementById("cardNumber").value.trim();
            const cardHolder = document.getElementById("cardHolder").value.trim();
            const cardExpiry = document.getElementById("cardExpiry").value.trim();
            const cardCvv = document.getElementById("cardCvv").value.trim();

            if (!/^\d{16}$/.test(cardNumber)) {
                alert("Please enter a valid 16-digit card number.");
                return;
            }

            if (cardHolder === "") {
                alert("Please enter the card holder name.");
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                alert("Please enter expiry in MM/YY format.");
                return;
            }

            if (!/^\d{3}$/.test(cardCvv)) {
                alert("Please enter a valid 3-digit CVV.");
                return;
            }
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const orderType = localStorage.getItem("orderType");
        const customerDetails = JSON.parse(localStorage.getItem("customerDetails")) || {};
        const loggedInUser = JSON.parse(localStorage.getItem("cafeUser")) || {};

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const customerName = customerDetails.name ||
            (loggedInUser.firstName ? loggedInUser.firstName + " " + loggedInUser.lastName : "Demo Customer");

        const phone = customerDetails.phone || loggedInUser.mobile || "9999999999";

        const orderNumber = "ORD-" + Date.now();

        const orderRequest = {
            orderId: Date.now(),
            orderNumber: orderNumber,
            orderType: orderType || "ONLINE",
            customerName: customerName,
            phone: phone,
            addressLine: customerDetails.address || "",
            city: customerDetails.city || "",
            pincode: customerDetails.pincode || "",
            paymentMethod: paymentMethod,
            paymentStatus: "SUCCESS",
            totalAmount: finalTotalAmount,
            originalAmount: originalTotalAmount,
            discountAmount: discountAmount,
            orderStatus: "CONFIRMED",
            createdAt: new Date().toISOString(),
            items: cart.map(item => ({
                itemId: item.itemId,
                name: item.itemName,
                itemName: item.itemName,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity,
                imageUrl: item.imageUrl
            }))
        };

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(orderRequest);

        localStorage.setItem("orders", JSON.stringify(orders));

        localStorage.setItem("paymentDetails", JSON.stringify({
            paymentMethod: paymentMethod,
            paymentStatus: "SUCCESS",
            originalAmount: originalTotalAmount,
            discountAmount: discountAmount,
            finalAmount: finalTotalAmount
        }));

        localStorage.setItem("savedOrderNumber", orderNumber);
        localStorage.setItem("lastOrder", JSON.stringify(orderRequest));

        localStorage.removeItem("cart");

        window.location.href = "success.html";
    });
}

function goToCart() {
    window.location.href = "cart.html";
}

function goToHome() {
    window.location.href = "index.html";
}