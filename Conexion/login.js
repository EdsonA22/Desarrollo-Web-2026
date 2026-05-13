const users = {
  estudiante: { email: "estudiante@universidad.edu", password: "estudiante123", name: "Maria Gonzalez Lopez", redirect: "index.html" },
  docente: { email: "docente@universidad.edu", password: "docente123", name: "Dr. Carlos Ramirez", redirect: "docentes.html" },
  admin: { email: "admin@universidad.edu", password: "admin123", name: "Admin Sistema", redirect: "reportes.html" }
};

let selectedRole = "estudiante";

const roleButtons = document.querySelectorAll("[data-role]");
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const credentialBox = document.getElementById("credentials");

function renderCredentials() {
  const user = users[selectedRole];
  credentialBox.innerHTML = `
    <strong>Credenciales de prueba</strong>
    <span>Usuario: ${user.email}</span>
    <span>Clave: ${user.password}</span>
  `;
  emailInput.placeholder = user.email;
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRole = button.dataset.role;
    roleButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderCredentials();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = users[selectedRole];
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (email !== user.email || password !== user.password) {
    document.getElementById("loginMessage").textContent = "Correo o contrasena incorrectos para el rol seleccionado.";
    return;
  }

  localStorage.setItem("sinapSession", JSON.stringify({ role: selectedRole, name: user.name, email: user.email }));
  window.location.href = user.redirect;
});

renderCredentials();
