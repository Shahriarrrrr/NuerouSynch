// Fade in the page on load
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
});

// Handle login form submission with transition
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
    localStorage.setItem("token", data.token);

    document.body.classList.remove("fade-in");
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = "news-feed.html";
    }, 500);
  } catch (err) {
    document.getElementById("error").textContent = err.message;
  }
});

// Handle fade-out transition when clicking Sign Up link
document.querySelector('.signup a').addEventListener('click', function (e) {
  e.preventDefault();
  const href = this.getAttribute('href');

  document.body.classList.remove("fade-in");
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = href;
  }, 500);
});
