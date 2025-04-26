let allProjects = []; // Save all fetched projects globally

// Fetch and render projects from API
async function fetchAndRenderProjects() {
  const projectsContainer = document.getElementById('projects');
  const token = localStorage.getItem("token");
  console.log(token)
  projectsContainer.innerHTML = ''; // Clear previous cards if any
  try {
    // Fetch both posts and users at the same time
    const [postsResponse, usersResponse, usersInfo] = await Promise.all([
      fetch('http://127.0.0.1:8000/post/api/posts/'),
      fetch('http://127.0.0.1:8000/user/api/users/'),
      fetch('http://127.0.0.1:8000/user/api/users/me/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    ]);

//     const token = localStorage.getItem("token");
  //   fetch('http://127.0.0.1:8000/user/api/users/me/', {
  //     method: 'GET',
  //     headers: {
  //         'Authorization': `Token ${token}`,
  //         'Content-Type': 'application/json'
  //     }
  // }).then(response => {
//     if (response.status === 401) {
//         // Unauthorized - token might be expired or invalid
//         alert("Session expired. Please login again.");
//         localStorage.removeItem("token"); // Clear invalid token
//         window.location.href = "UserLogin.html";
//         throw new Error('Unauthorized access');
//     }

//     if (!response.ok) {
//         throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
//     }

//     return response.json();
// })
    const projectsData = await postsResponse.json();
    const usersData = await usersResponse.json();
    const userInfo = await usersInfo.json();
    const userName = userInfo.full_name;
    const UserImage = userInfo.profile_image
    console.log(UserImage)
    document.getElementById('Name').textContent = `Hello ${userName},`;
    allProjects = projectsData; // Save the original data
    const profilePic = document.getElementById('sidebar-profile-pic');
    profilePic.src = userInfo.profile_image; // Set the new image link


    // Create a mapping from email -> profile_image
    const emailToProfileImage = {};
    usersData.forEach(user => {
      emailToProfileImage[user.email] = user.profile_image;
    });

    // Sort projects by 'created_at' date in descending order
    projectsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    renderProjects(projectsData, emailToProfileImage);

  } catch (error) {
    console.error('Error fetching projects:', error);
    projectsContainer.innerHTML = '<p>Failed to load projects.</p>';
  }
}

function renderProjects(projectsData, emailToProfileImage) {
  const projectsContainer = document.getElementById('projects');
  projectsContainer.innerHTML = ''; // Clear previous

  projectsData.forEach(project => {
    const card = document.createElement('div');
    card.className = 'card';

    const profileImage = emailToProfileImage[project.author] || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    const shortDescription = project.description.length > 100
      ? project.description.slice(0, 100) + '...'
      : project.description;

    card.innerHTML = `
      <div class="card-info">
        <p class="title">${project.title}</p>
        <p>Author: ${project.author}</p>
        <p>Description: ${shortDescription}</p>
        <p>Date Published: ${new Date(project.created_at).toLocaleDateString()}</p>
        <a href="${project.publications}" target="_blank">
          <button class="view-btn">View Publication</button>
        </a>
        ${project.description.length > 100 ? `<button class="see-more-btn">See More</button>` : ''}
      </div>
      <img src="${profileImage}" class="avatar"/>
    `;

    // Add event listener for See More
    if (project.description.length > 100) {
      const seeMoreBtn = card.querySelector('.see-more-btn');
      seeMoreBtn.addEventListener('click', () => {
        openModal(project);
      });
    }

    projectsContainer.appendChild(card);
  });
}


// Search functionality
function handleSearch() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();

  const filteredProjects = allProjects.filter(project =>
    project.title.toLowerCase().includes(searchInput)
  );

  // Fetch users again for mapping (optional optimization: cache it)
  fetch('http://127.0.0.1:8000/user/api/users/')
    .then(res => res.json())
    .then(usersData => {
      const emailToProfileImage = {};
      usersData.forEach(user => {
        emailToProfileImage[user.email] = user.profile_image;
      });

      // Sort filtered projects by date in descending order before rendering
      filteredProjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      renderProjects(filteredProjects, emailToProfileImage);
    })
    .catch(error => {
      console.error('Error fetching users for search:', error);
    });
}

// Calendar generation (same as before)
function generateCalendar() {
  const today = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = today.getMonth();
  const year = today.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarBody = document.getElementById("calendar-body");
  const monthYear = document.getElementById("month-year");

  monthYear.textContent = `${monthNames[month]} ${year}`;
  calendarBody.innerHTML = "";

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      const adjustedDay = (j + 6) % 7;

      if (i === 0 && adjustedDay < firstDay) {
        cell.textContent = "";
      } else if (date > daysInMonth) {
        cell.textContent = "";
      } else {
        cell.textContent = date;
        if (
          date === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          cell.classList.add("active");
        }
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}
function openModal(project) {
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-author').textContent = `Author: ${project.author}`;
  document.getElementById('modal-date').textContent = `Date Published: ${new Date(project.created_at).toLocaleDateString()}`;
  document.getElementById('modal-description').textContent = project.description; // full description
  document.getElementById('project-modal').style.display = 'block';
}
// Run on page load
fetchAndRenderProjects();
generateCalendar();

// Attach search button click
document.getElementById('search-button').addEventListener('click', handleSearch);
