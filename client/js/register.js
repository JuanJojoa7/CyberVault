const baseURL = 'http://localhost:3000';

/* PASSWORD INPUT */
const Password_input = document.querySelector(".password--input");
const ConfirmPassword_input = document.querySelector(".confirm_password--input");

/* PASSWORD EYE ICON */
const Password_eye_icon = document.querySelector("#password_hidden");
const ConfirmPassword_eye_icon = document.querySelector("#confirm_password_hidden");

/* PASSWORD EYE ICON EVENTLISTENER */
Password_eye_icon.addEventListener("click", () => {
    togglePasswordVisibility(Password_input, Password_eye_icon);
});

ConfirmPassword_eye_icon.addEventListener("click", () => {
    togglePasswordVisibility(ConfirmPassword_input, ConfirmPassword_eye_icon);
});

function togglePasswordVisibility(input, icon) {
    if (input.type === "password") {
        input.type = "text";
        icon.setAttribute("name", "eye-outline");
        icon.removeAttribute("name", "eye-off-outline");
    } else {
        input.type = "password";
        icon.setAttribute("name", "eye-off-outline");
        icon.removeAttribute("name", "eye-outline");
    }
}

/* FORM SUBMIT EVENTLISTENER */
const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    console.log("Submit pressed");

    if (password !== confirm_password) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        const response = await axios.post(`${baseURL}/api/register`, {
            fullname,
            email,
            password
        });

        if (response.status === 200) {
            alert('User created successfully');
            window.location.href = "login.html";
        }

    } catch (error) {
        errorMessage.textContent = 'Email already in use. Please try again with a different email.';
        errorMessage.style.display = 'block';
    }
});