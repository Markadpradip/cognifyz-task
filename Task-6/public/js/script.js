// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "🙈";
            togglePassword.setAttribute("aria-label", "Hide password");
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "👁️";
            togglePassword.setAttribute("aria-label", "Show password");
        }
    });
}


// ==========================================
// MESSAGE FUNCTION
// ==========================================

function showMessage(message, type = "danger") {
    const messageBox = document.getElementById("message");

    if (!messageBox) return;

    messageBox.className = `alert alert-${type}`;
    messageBox.textContent = message;
    messageBox.classList.remove("d-none");
}

function hideMessage() {
    const messageBox = document.getElementById("message");

    if (!messageBox) return;

    messageBox.classList.add("d-none");
}


// ==========================================
// REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        hideMessage();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                showMessage(result.message, "danger");
                return;
            }

            showMessage(
                "Registration successful. Redirecting to login...",
                "success"
            );

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "/login";
            }, 1200);

        } catch (error) {
            console.error("Register Error:", error);

            showMessage(
                "Unable to connect to server.",
                "danger"
            );
        }
    });
}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        hideMessage();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                showMessage(result.message, "danger");
                return;
            }

            // Save JWT token
            localStorage.setItem("token", result.token);

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 800);

        } catch (error) {
            console.error("Login Error:", error);

            showMessage(
                "Unable to connect to server.",
                "danger"
            );
        }
    });
}


// ==========================================
// DASHBOARD
// ==========================================

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

if (userName && userEmail) {
    loadDashboard();
}

async function loadDashboard() {
    const token = localStorage.getItem("token");

    // No token
    if (!token) {
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("/api/auth/me", {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
        }

        userName.textContent = result.data.name;
        userEmail.textContent = result.data.email;

    } catch (error) {
        console.error("Dashboard Error:", error);

        localStorage.removeItem("token");
        window.location.href = "/login";
    }
}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");

        window.location.href = "/login";
    });
}