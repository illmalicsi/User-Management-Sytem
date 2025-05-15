const postsUrl = "https://jsonplaceholder.typicode.com/posts";
const usersUrl = "https://jsonplaceholder.typicode.com/users";

let posts = [];
let users = [];

const postContainer = document.getElementById("postContainer");
const searchTitle = document.getElementById("searchTitle");
const authorFilter = document.getElementById("authorFilter");

const userModal = document.getElementById("userModal");
const closeModalBtn = document.getElementById("closeModal");

const modalName = document.getElementById("modalName");
const modalUsername = document.getElementById("modalUsername");
const modalEmail = document.getElementById("modalEmail");
const modalPhone = document.getElementById("modalPhone");
const modalWebsite = document.getElementById("modalWebsite");
const modalCompany = document.getElementById("modalCompany");
const modalAddress = document.getElementById("modalAddress");

closeModalBtn.onclick = () => {
  userModal.classList.add("hidden");
};

window.onclick = (e) => {
  if (e.target === userModal) {
    userModal.classList.add("hidden");
  }
};

async function fetchData() {
  const postRes = await fetch(postsUrl);
  posts = await postRes.json();

  const userRes = await fetch(usersUrl);
  users = await userRes.json();

  populateAuthorFilter();
  renderPosts();
}

function populateAuthorFilter() {
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    authorFilter.appendChild(option);
  });
}

function renderPosts() {
  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title
      .toLowerCase()
      .includes(searchTitle.value.toLowerCase());
    
    const authorMatch =
      authorFilter.value === "all" || post.userId == authorFilter.value;
    
    return titleMatch && authorMatch;
  });

  postContainer.innerHTML = "";

  filteredPosts.forEach((post) => {
    const user = users.find((u) => u.id === post.userId);
    const postDiv = document.createElement("div");
    postDiv.className =
      "bg-card-dark rounded-lg p-6 shadow-lg border border-gray-800/50 hover:bg-gray-800/50 transition-colors duration-200";
    postDiv.innerHTML = `
      <h2 class="text-xl font-semibold mb-3 text-white">${post.title}</h2>
      <p class="text-gray-400 mb-4">${post.body}</p>
      <div class="flex items-center text-sm text-gray-500">
        <span>Author: </span>
        <span class="ml-1 text-gray-400">${user.name}</span>
      </div>
    `;
    postDiv.onclick = () => showUserModal(user);
    postContainer.appendChild(postDiv);
  });
}

function showUserModal(user) {
  modalName.textContent = user.name;
  modalUsername.textContent = user.username;
  modalEmail.textContent = user.email;
  modalPhone.textContent = user.phone;
  modalWebsite.textContent = user.website;
  modalCompany.textContent = user.company.name;
  modalAddress.textContent = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
  userModal.classList.remove("hidden");
}

searchTitle.addEventListener("input", renderPosts);
authorFilter.addEventListener("change", renderPosts);

fetchData();
