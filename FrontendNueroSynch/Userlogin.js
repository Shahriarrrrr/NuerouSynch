document.getElementById("loginform").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const username = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    try {
      const res = await fetch("http://127.0.0.1:8000/login/accounts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
  
      const data = await res.json();
      localStorage.setItem("token", data.token); // Save token in localStorage
  
      // Redirect to profile page
      window.location.href = "UserProfile.html";
    } catch (err) {
      document.getElementById("error").textContent = err.message;
    }
  });
  