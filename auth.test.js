const auth = require("./auth");

beforeAll(() => {
    delete window.location;
    window.location = { href: jest.fn() }; 
    global.alert = jest.fn(); 
});

beforeEach(() => {
    document.body.innerHTML = `
        <input id="name" value="Test User"/>
        <input id="email" value="test@gmail.com"/>
        <input id="password" value="password123"/>
        <input id="confirmPassword" value="password123"/>
    `;
    localStorage.clear(); 
});

describe("Authentication Tests", () => {
    test("Valid email passes validation", () => {
        expect(auth.isValidEmail("test@gmail.com")).toBe(true);
    });

    test("Invalid email fails validation", () => {
        expect(auth.isValidEmail("test@yahoo.com")).toBe(false);
    });

    test("Valid password passes validation", () => {
        expect(auth.isValidPassword("password123")).toBe(true);
    });

    test("Invalid password fails validation", () => {
        expect(auth.isValidPassword("short")).toBe(false);
    });

    test("Successful signup stores user in localStorage", () => {
        auth.signup();
        const users = JSON.parse(localStorage.getItem("users"));
        expect(users).not.toBeNull();
        expect(users[0].email).toBe("test@gmail.com");
    });

    test("Login succeeds with correct credentials", () => {
        localStorage.setItem("users", JSON.stringify([{ name: "Test User", email: "test@gmail.com", password: "password123" }]));
        auth.login();
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        expect(currentUser.email).toBe("test@gmail.com");
    });

    test("Login fails with incorrect password", () => {
        localStorage.setItem("users", JSON.stringify([{ email: "test@gmail.com", password: "password123" }]));
        document.getElementById("password").value = "wrongpassword";
        auth.login();
        expect(localStorage.getItem("currentUser")).toBeNull();
        expect(alert).toHaveBeenCalledWith("Invalid credentials. Please try again."); 
    });

    test("Logout clears currentUser", () => {
        localStorage.setItem("currentUser", JSON.stringify({ email: "test@gmail.com" }));
        auth.logout();
        expect(localStorage.getItem("currentUser")).toBeNull();
    });
});
