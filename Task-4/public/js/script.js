// ==========================================
// CLIENT-SIDE ROUTING
// ==========================================

function navigateTo(page) {
    window.location.hash = page;
}

function showPage(page) {

    const sections = document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(page);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    } else {
        document.getElementById("home").classList.add("active-page");
    }
}

function handleRouting() {

    let page = window.location.hash.substring(1);

    if (!page) {
        page = "home";
    }

    if (
        page !== "home" &&
        page !== "register" &&
        page !== "about"
    ) {
        page = "home";
    }

    showPage(page);
}

window.addEventListener("hashchange", handleRouting);

document.addEventListener("DOMContentLoaded", () => {

    handleRouting();

    setupForm();

});


// ==========================================
// FORM SETUP
// ==========================================

function setupForm() {

    const form = document.getElementById("registrationForm");

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const age = document.getElementById("age");
    const city = document.getElementById("city");
    const password = document.getElementById("password");
    const confirmPassword =
        document.getElementById("confirmPassword");


    // Dynamic DOM updates

    form.addEventListener("input", () => {

        updatePasswordStrength();
        updateFormProgress();

    });


    // Form submit

   form.addEventListener("submit", (event) => {

    event.preventDefault();

    clearErrors();

    const isValid = validateForm();

    if (!isValid) {
        return;
    }

    // Allow normal form submission
    form.submit();
});

}


// ==========================================
// FORM VALIDATION
// ==========================================

function validateForm() {

    let valid = true;


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const age =
        Number(document.getElementById("age").value);

    const city =
        document.getElementById("city").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // NAME

    if (name.length < 3) {

        showError(
            "nameError",
            "Name must contain at least 3 characters."
        );

        markInvalid("name");

        valid = false;

    } else {

        markValid("name");

    }


    // EMAIL

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showError(
            "emailError",
            "Please enter a valid email address."
        );

        markInvalid("email");

        valid = false;

    } else {

        markValid("email");

    }


    // AGE

    if (
        !Number.isInteger(age) ||
        age < 18 ||
        age > 60
    ) {

        showError(
            "ageError",
            "Age must be between 18 and 60."
        );

        markInvalid("age");

        valid = false;

    } else {

        markValid("age");

    }


    // CITY

    if (city.length < 2) {

        showError(
            "cityError",
            "Please enter a valid city."
        );

        markInvalid("city");

        valid = false;

    } else {

        markValid("city");

    }


    // PASSWORD

    const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!strongPassword.test(password)) {

        showError(
            "passwordError",
            "Password does not meet all requirements."
        );

        markInvalid("password");

        valid = false;

    } else {

        markValid("password");

    }


    // CONFIRM PASSWORD

    if (
        !confirmPassword ||
        confirmPassword !== password
    ) {

        showError(
            "confirmPasswordError",
            "Passwords do not match."
        );

        markInvalid("confirmPassword");

        valid = false;

    } else {

        markValid("confirmPassword");

    }


    return valid;
}


// ==========================================
// PASSWORD STRENGTH
// ==========================================

function updatePasswordStrength() {

    const password =
        document.getElementById("password").value;

    const strengthBar =
        document.getElementById("strengthBar");

    const strengthText =
        document.getElementById("strengthText");


    const hasLength =
        password.length >= 8;

    const hasUpper =
        /[A-Z]/.test(password);

    const hasLower =
        /[a-z]/.test(password);

    const hasNumber =
        /\d/.test(password);

    const hasSpecial =
        /[^A-Za-z0-9]/.test(password);


    // Update rules dynamically

    updateRule("ruleLength", hasLength);
    updateRule("ruleUpper", hasUpper);
    updateRule("ruleLower", hasLower);
    updateRule("ruleNumber", hasNumber);
    updateRule("ruleSpecial", hasSpecial);


    let score = 0;

    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;


    const percentage = score * 20;

    strengthBar.style.width =
        `${percentage}%`;


    if (password.length === 0) {

        strengthText.textContent =
            "Password strength";

    } else if (score <= 2) {

        strengthText.textContent =
            "Weak password";

    } else if (score <= 4) {

        strengthText.textContent =
            "Medium password";

    } else {

        strengthText.textContent =
            "Strong password";

    }

}


// ==========================================
// PASSWORD RULE DOM UPDATE
// ==========================================

function updateRule(id, valid) {

    const rule =
        document.getElementById(id);

    if (valid) {

        rule.classList.add("valid");

        if (!rule.textContent.includes("✓")) {
            rule.textContent =
                "✓ " + rule.textContent;
        }

    } else {

        rule.classList.remove("valid");

        rule.textContent =
            rule.textContent.replace("✓ ", "");

    }

}


// ==========================================
// FORM PROGRESS
// ==========================================

function updateFormProgress() {

    const fields = [

        document.getElementById("name").value.trim(),

        document.getElementById("email").value.trim(),

        document.getElementById("age").value,

        document.getElementById("city").value.trim(),

        document.getElementById("password").value,

        document.getElementById("confirmPassword").value

    ];


    let completed = 0;

    fields.forEach(field => {

        if (field !== "") {
            completed++;
        }

    });


    const percentage =
        Math.round((completed / fields.length) * 100);


    document.getElementById(
        "formProgress"
    ).style.width = `${percentage}%`;


    document.getElementById(
        "progressText"
    ).textContent = `${percentage}%`;

}


// ==========================================
// ERROR HANDLING
// ==========================================

function showError(id, message) {

    document.getElementById(id).textContent =
        message;

}


function clearErrors() {

    const errors =
        document.querySelectorAll(".error");

    errors.forEach(error => {

        error.textContent = "";

    });


    const inputs =
        document.querySelectorAll(".form-control");

    inputs.forEach(input => {

        input.classList.remove(
            "valid-input",
            "invalid-input"
        );

    });

}


function markValid(id) {

    document.getElementById(id)
        .classList.add("valid-input");

    document.getElementById(id)
        .classList.remove("invalid-input");

}


function markInvalid(id) {

    document.getElementById(id)
        .classList.add("invalid-input");

    document.getElementById(id)
        .classList.remove("valid-input");

}


// ==========================================
// FORM MESSAGE
// ==========================================

function showFormMessage(message, type) {

    const formMessage =
        document.getElementById("formMessage");

    formMessage.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;

}


// ==========================================
// RESET PASSWORD STRENGTH
// ==========================================

function resetPasswordStrength() {

    document.getElementById(
        "strengthBar"
    ).style.width = "0%";

    document.getElementById(
        "strengthText"
    ).textContent =
        "Password strength";


    const rules = [
        "ruleLength",
        "ruleUpper",
        "ruleLower",
        "ruleNumber",
        "ruleSpecial"
    ];


    rules.forEach(id => {

        const rule =
            document.getElementById(id);

        rule.classList.remove("valid");

        rule.textContent =
            rule.textContent.replace("✓ ", "");

    });

}