document.addEventListener("DOMContentLoaded", function () {
    const deliveryForm = document.getElementById("deliveryForm");

    if (deliveryForm) {
        deliveryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const address = document.getElementById("address").value.trim();
            const city = document.getElementById("city").value.trim();
            const pincode = document.getElementById("pincode").value.trim();

            if (name === "" || phone === "" || address === "" || city === "" || pincode === "") {
                alert("Please fill in all delivery details.");
                return;
            }

            const customerDetails = {
                name: name,
                phone: phone,
                address: address,
                city: city,
                pincode: pincode
            };

            localStorage.setItem("customerDetails", JSON.stringify(customerDetails));
            window.location.href = "payment.html";
        });
    }
});

function goToCart() {
    window.location.href = "cart.html";
}

function goToHome() {
    window.location.href = "index.html";
}