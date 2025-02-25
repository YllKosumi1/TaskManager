// auth.js
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && window.location.pathname.includes("index.html")) {
        window.location.href = "taskmanager.html";
    } else if (!currentUser && window.location.pathname.includes("taskmanager.html")) {
        window.location.href = "index.html";
    }
});

function isValidPassword(password) {
    return password.length >= 8;
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailPattern.test(email);
}

function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    
    if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required");
        return;
    }
    if (!isValidEmail(email)) {
        alert("Invalid email format. Only Gmail addresses are allowed (e.g., example@gmail.com)");
        return;
    }
    if (!isValidPassword(password)) {
        alert("Password must be at least 8 characters long");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(user => user.email === email)) {
        alert("User already exists. Please log in.");
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify({ name, email }));
    window.location.href = "taskmanager.html";
}

function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) {
        alert("All fields are required");
        return;
    }
    if (!isValidEmail(email)) {
        alert("Invalid email format. Only Gmail addresses are allowed (e.g., example@gmail.com)");
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        alert("Invalid credentials. Please try again.");
        return;
    }
    
    localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email }));
    window.location.href = "taskmanager.html";
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Export functions for testing
module.exports = {
    isValidEmail,
    isValidPassword,
    signup,
    login,
    logout
};
