      // Fetch user data from API with token handling
      document.addEventListener('DOMContentLoaded', function() {
        // Get the auth token from localStorage
        const token = localStorage.getItem("token");
    
        // Check if token exists
        if (!token) {
            alert("No token found. Redirecting to login...");
            window.location.href = "UserLogin.html";
            return; // Stop execution if no token
        }
    
        // Token exists, proceed with API request to get user data
        fetch('http://127.0.0.1:8000/user/api/users/me/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Unauthorized - token might be expired or invalid
                alert("Session expired. Please login again.");
                localStorage.removeItem("token"); // Clear invalid token
                window.location.href = "UserLogin.html";
                throw new Error('Unauthorized access');
            }
    
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
    
            return response.json();
        })
        .then(data => {
            console.log('User data retrieved:', data);
            // Call function to populate UI with the fetched data
            populateUI(data);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
    
            // Only show error alert if it's not the unauthorized error we already handled
            if (!error.message.includes('Unauthorized')) {
                alert("Failed to load user data. Please try again later.");
            }
        });
    
        // Fetch the user's publications (from the PublicationPost model)
        fetch('http://127.0.0.1:8000/post/api/my-posts/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "UserLogin.html";
                throw new Error('Unauthorized access');
            }
    
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
    
            return response.json();
        })
        .then(publicationsData => {
            console.log('Publications data retrieved:', publicationsData);
            // Call function to populate UI with publications
            populatePublications(publicationsData);
        })
        .catch(error => {
            console.error('Error fetching publications data:', error);
    
            // Handle error if needed, you could display a placeholder or error message
            alert("Failed to load publications. Please try again later.");
        });
    });
    
    // Function to populate UI with user data
    function populateUI(data) {
        // Set user name and ID
        document.getElementById('user-name').textContent = data.full_name || 'No Name';
        document.getElementById('user-id').textContent = data.id || '';
    
        // Set department
        document.getElementById('department-info').textContent = 
            data.department ? `${data.department}` : 'Not specified';
    
        // Set interests
        const interestsContainer = document.getElementById('interests-container');
        interestsContainer.innerHTML = '';
    
        if (data.interested_field) {
            // Split by comma if multiple interests
            const interests = data.interested_field.split(',').map(item => item.trim());
    
            interests.forEach(interest => {
                const interestTag = document.createElement('div');
                interestTag.className = 'interest-tag';
                interestTag.textContent = interest;
                interestsContainer.appendChild(interestTag);
            });
    
            // Add extra interest tags based on UI in image if needed
            if (interests.length < 3) {
                const extraInterests = ['Robotics', 'UI'];
                extraInterests.forEach(interest => {
                    if (!interests.includes(interest)) {
                        const interestTag = document.createElement('div');
                        interestTag.className = 'interest-tag';
                        interestTag.textContent = interest;
                        interestsContainer.appendChild(interestTag);
                    }
                });
            }
        } else {
            interestsContainer.innerHTML = '<span class="no-content">No interests specified</span>';
        }
    
        // Set profile image
        const profileImg = data.profile_image || '/api/placeholder/120/120';
        document.getElementById('main-profile-pic').src = profileImg;
        document.getElementById('sidebar-profile-pic').src = profileImg;
    
        // Add click handlers for edit buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sectionTitle = this.closest('.section-title').textContent.trim().replace('Edit', '').trim();
                alert(`Edit ${sectionTitle} functionality would go here`);
            });
        });
    
        // Add click handlers for "see more" buttons
        const seeMoreLinks = document.querySelectorAll('.see-more');
        seeMoreLinks.forEach(link => {
            link.addEventListener('click', function() {
                const sectionTitle = this.closest('.section-title').textContent.trim().replace('See more', '').trim();
                alert(`View all ${sectionTitle} functionality would go here`);
            });
        });
    }
    
// Function to populate UI with publications data
// Function to populate UI with publications data
function populatePublications(publications) {
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';

  if (publications && publications.length > 0) {
      publications.forEach(pub => {
          const pubCard = document.createElement('div');
          pubCard.className = 'publication-card';

          // Title
          const title = document.createElement('h3');
          title.textContent = pub.title;
          pubCard.appendChild(title);

          // Description
          const description = document.createElement('p');
          description.className = 'publication-description';
          description.textContent = pub.description;
          pubCard.appendChild(description);

          // Toggle expand/collapse description
          const seeMoreButton = document.createElement('span');
          seeMoreButton.className = 'see-more';
          seeMoreButton.textContent = 'See more';
          seeMoreButton.addEventListener('click', () => {
              description.classList.toggle('expanded');
              seeMoreButton.textContent = description.classList.contains('expanded') ? 'See less' : 'See more';
          });
          pubCard.appendChild(seeMoreButton);

          // Add a download link for the file (if available)
          if (pub.publications) {
              const downloadButton = document.createElement('a');
              downloadButton.href = pub.publications; // Same file URL
              downloadButton.download = pub.title || 'publication'; // Set a filename for download
              downloadButton.textContent = "Download";
              downloadButton.className = 'download-btn';
              pubCard.appendChild(downloadButton);
          }

          publicationsContainer.appendChild(pubCard);
      });
  } else {
      // If no publications exist, show a message
      publicationsContainer.innerHTML = '<p>No publications available.</p>';
  }
}


// const token = localStorage.getItem("token");

// if (!token) {
//   alert("No token found. Redirecting to login...");
//   window.location.href = "UserLogin.html";
// }

// fetch("http://127.0.0.1:8000/user/api/users/me/", {
//   headers: {
//     Authorization: "Token " + token
//   }
// })
//   .then(res => {
//     if (!res.ok) throw new Error("Unauthorized");
//     return res.json();
//   })
//   .then(data => {
//     document.getElementById("name").textContent = data.full_name;
//     document.getElementById("student_id").textContent = data.student_id;
//     document.getElementById("department").textContent = data.department;
//     document.getElementById("avatar").src = data.avatar_url || "default.jpg";

//     // Interests
// const interests = document.getElementById("interests");
// interests.innerHTML = "";
// if (Array.isArray(data.interests) && data.interests.length > 0) {
//   data.interests.forEach(interest => {
//     const tag = document.createElement("span");
//     tag.textContent = interest;
//     interests.appendChild(tag);
//   });
// } else {
//   interests.innerHTML = "<i>No interests listed</i>";
// }

// // Publications
// const pubs = document.getElementById("publications");
// pubs.innerHTML = "";
// if (Array.isArray(data.publications) && data.publications.length > 0) {
//   data.publications.forEach(pub => {
//     const img = document.createElement("img");
//     img.src = pub.image_url || "placeholder.png";
//     img.alt = pub.title || "Publication";
//     img.style.width = "100px";
//     pubs.appendChild(img);
//   });
// } else {
//   pubs.innerHTML = "<i>No publications available</i>";
// }

// // Friends
// const friends = document.getElementById("friends");
// friends.innerHTML = "";
// if (Array.isArray(data.friends) && data.friends.length > 0) {
//   data.friends.forEach(friend => {
//     const li = document.createElement("li");
//     li.innerHTML = `
//       ${friend.name || "Unnamed"} 
//       <img src="${friend.avatar || 'default-avatar.jpg'}" width="24" style="border-radius:50%"/>
//     `;
//     friends.appendChild(li);
//   });
// } else {
//   friends.innerHTML = "<i>No friends added yet</i>";
// }

//   })
//   .catch(err => {
//     console.log(err)
//     alert("Session expired or unauthorized. Please login.");
//     //localStorage.removeItem("token");
//     //window.location.href = "UserLogin.html";
//   });



// // const token = localStorage.getItem("token");

// // fetch("http://127.0.0.1:8000/user/api/users/me/", {
// //   method: "GET",
// //   headers: {
// //     "Authorization": "Token " + token,
// //   },
// // })
// //   .then(res => {
// //     if (!res.ok) throw new Error("Not logged in");
// //     return res.json();
// //   })
// //   .then(data => {
// //     console.log(data);  // Now it's correctly placed
// //     document.getElementById("username").textContent = data.full_name;
// //     document.getElementById("email").textContent = data.email;
// //   })
// //   .catch(err => {
// //     alert("Session expired. Please login again.");
// //     //localStorage.removeItem("token");
// //     //window.location.href = "/login.html";
// //   });
