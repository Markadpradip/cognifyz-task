const API_URL = "/api/users";

// ======================================
// DOM ELEMENTS
// ======================================

const userForm = document.getElementById("userForm");

const userIdInput = document.getElementById("userId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const cityInput = document.getElementById("city");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const refreshBtn = document.getElementById("refreshBtn");

const userTableBody = document.getElementById("userTableBody");
const messageBox = document.getElementById("message");


// ======================================
// SHOW MESSAGE
// ======================================

function showMessage(message, type = "success") {
    messageBox.textContent = message;

    messageBox.className = `alert alert-${type}`;
}


// ======================================
// HIDE MESSAGE
// ======================================

function hideMessage() {
    messageBox.className = "alert d-none";
    messageBox.textContent = "";
}


// ======================================
// GET ALL USERS
// ======================================

async function getUsers() {

    try {

        userTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Loading users...
                </td>
            </tr>
        `;

        const response = await fetch(API_URL);

        const result = await response.json();

        if (!result.success) {
            throw new Error("Unable to fetch users.");
        }

        displayUsers(result.data);

    } catch (error) {

        console.error(error);

        userTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Failed to load users.
                </td>
            </tr>
        `;
    }
}


// ======================================
// DISPLAY USERS
// ======================================

function displayUsers(users) {

    if (users.length === 0) {

        userTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }


    userTableBody.innerHTML = users.map(user => {

        return `
            <tr>

                <td>${user.id}</td>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>${user.city}</td>

                <td>

                    <button
                        class="btn btn-sm btn-warning me-2"
                        onclick="editUser(${user.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deleteUser(${user.id})"
                    >
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join("");
}


// ======================================
// CREATE / UPDATE USER
// ======================================

userForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    hideMessage();


    const id = userIdInput.value;

    const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        city: cityInput.value.trim()
    };


    // ==================================
    // BASIC FRONTEND VALIDATION
    // ==================================

    if (!userData.name || !userData.email || !userData.city) {

        showMessage(
            "Please fill all fields.",
            "danger"
        );

        return;
    }


    try {

        let response;


        // ==================================
        // UPDATE
        // ==================================

        if (id) {

            response = await fetch(`${API_URL}/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)

            });

        }

        // ==================================
        // CREATE
        // ==================================

        else {

            response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)

            });

        }


        const result = await response.json();


        if (!response.ok) {

            throw new Error(result.message);

        }


        // ==================================
        // SUCCESS
        // ==================================

        showMessage(
            result.message,
            "success"
        );


        resetForm();

        getUsers();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message || "Something went wrong.",
            "danger"
        );

    }

});


// ======================================
// EDIT USER
// ======================================

async function editUser(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const result = await response.json();


        if (!response.ok) {

            throw new Error(result.message);

        }


        const user = result.data;


        userIdInput.value = user.id;

        nameInput.value = user.name;

        emailInput.value = user.email;

        cityInput.value = user.city;


        submitBtn.textContent = "Update User";

        submitBtn.classList.remove("btn-primary");

        submitBtn.classList.add("btn-success");


        cancelBtn.classList.remove("d-none");


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        showMessage(
            error.message || "Unable to load user.",
            "danger"
        );

    }

}


// ======================================
// DELETE USER
// ======================================

async function deleteUser(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this user?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });


        const result = await response.json();


        if (!response.ok) {

            throw new Error(result.message);

        }


        showMessage(
            result.message,
            "success"
        );


        getUsers();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message || "Unable to delete user.",
            "danger"
        );

    }

}


// ======================================
// RESET FORM
// ======================================

function resetForm() {

    userForm.reset();

    userIdInput.value = "";

    submitBtn.textContent = "Add User";

    submitBtn.classList.remove("btn-success");

    submitBtn.classList.add("btn-primary");

    cancelBtn.classList.add("d-none");

}


// ======================================
// CANCEL EDIT
// ======================================

cancelBtn.addEventListener("click", () => {

    resetForm();

    hideMessage();

});


// ======================================
// REFRESH USERS
// ======================================

refreshBtn.addEventListener("click", () => {

    getUsers();

});


// ======================================
// INITIAL LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    getUsers();

});