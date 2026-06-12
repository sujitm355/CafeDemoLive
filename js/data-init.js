(function initializeDemoData() {

    if (!localStorage.getItem("adminUserDefault")) {
        localStorage.setItem("adminUserDefault", JSON.stringify({
            username: "admin",
            password: "admin123",
            role: "ADMIN"
        }));
    }

    if (!localStorage.getItem("staffUserDefault")) {
        localStorage.setItem("staffUserDefault", JSON.stringify({
            username: "staff",
            password: "staff123",
            staffName: "Demo Staff",
            role: "STAFF"
        }));
    }

    if (!localStorage.getItem("menuItems")) {
        if (typeof menuItems !== "undefined") {
            localStorage.setItem("menuItems", JSON.stringify(menuItems));
        }
    }

})();