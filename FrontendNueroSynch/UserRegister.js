window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("fade-in");
  });
document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Collect form values
    const full_name = document.getElementById("name").value;
    const phone_number = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const profile_id = document.getElementById("id").value;
    const password = document.getElementById("password").value;
    const department = document.getElementById("department").value;

    // Construct request payload
    const data = {
        full_name,
        phone_number,
        email,
        profile_id,
        password,
        department
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/user/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message
            const formContainer = document.querySelector(".form-container");
            formContainer.innerHTML = `
                <h2>🎉 Registration Successful!</h2>
                <p>Redirecting to sign in...</p>
            `;
            formContainer.style.textAlign = "center";

            // Add fade-out before redirect
            setTimeout(() => {
                document.body.classList.add("fade-out");
            }, 1000);

            setTimeout(() => {
                window.location.href = "UserLogin.html";
            }, 1500); // after fade-out is visible
        } else {
            alert("Registration failed: " + (result.detail || "Unknown error"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Check console for details.");
    }
});
