const token = localStorage.getItem("token");

fetch("http://127.0.0.1:8000/user/api/users/me/", {
  method: "GET",
  headers: {
    "Authorization": "Token " + token,
  },
})
  .then(res => {
    if (!res.ok) throw new Error("Not logged in");
    return res.json();
  })
  .then(data => {
    console.log(data);  // Now it's correctly placed
    document.getElementById("username").textContent = data.full_name;
    document.getElementById("email").textContent = data.email;
  })
  .catch(err => {
    alert("Session expired. Please login again.");
    //localStorage.removeItem("token");
    //window.location.href = "/login.html";
  });
