const redirects = {
  estudiante: "estudiante.html",
  docente: "docentes.html",
  admin: "reportes.html",
};

let selectedRole = "estudiante";
let selectedMode = "login";

const roleButtons = document.querySelectorAll("[data-role]");
const modeButtons = document.querySelectorAll("[data-mode]");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const emailInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");

const credentialBox = document.getElementById("credentials");

const studentRegisterFields = document.getElementById("studentRegisterFields");

const teacherRegisterFields = document.getElementById("teacherRegisterFields");

const registerTeacher = document.getElementById("registerTeacher");

function renderTeacherOptions() {
  const teachers = sinap.getUsersByRole("docente");

  registerTeacher.innerHTML = `
    <option value="">Sin docente asignado</option>
    ${teachers
      .map(
        (teacher) => `
          <option value="${sinap.escapeHtml(teacher.email)}">
            ${sinap.escapeHtml(teacher.name)}
          </option>
        `,
      )
      .join("")}
  `;
}

function renderCredentials() {
  const demoUser = sinap.getUsersByRole(selectedRole)[0];

  if (selectedMode === "register") {
    credentialBox.innerHTML = `
      <strong>Registro de perfil</strong>
      <span>
        El perfil creado podrá iniciar sesión con su correo y contraseña.
      </span>
    `;
    return;
  }

  credentialBox.innerHTML = demoUser
    ? `
      <strong>Credenciales de prueba</strong>
      <span>Usuario: ${sinap.escapeHtml(demoUser.email)}</span>
      <span>Clave: ${sinap.escapeHtml(demoUser.password)}</span>
    `
    : `
      <strong>Sin usuarios registrados</strong>
      <span>Crea un perfil para este rol.</span>
    `;

  emailInput.placeholder = demoUser?.email || "correo@universidad.edu";
}

function syncRoleFields() {
  studentRegisterFields.hidden = selectedRole !== "estudiante";

  teacherRegisterFields.hidden = selectedRole !== "docente";

  document.getElementById("registerCareer").required =
    selectedRole === "estudiante";

  document.getElementById("registerCareers").required =
    selectedRole === "docente";

  renderTeacherOptions();
  renderCredentials();
}

function syncMode() {
  loginForm.hidden = selectedMode !== "login";
  registerForm.hidden = selectedMode !== "register";

  document.getElementById("loginMessage").textContent = "";
  document.getElementById("registerMessage").textContent = "";

  renderCredentials();
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRole = button.dataset.role;

    roleButtons.forEach((item) =>
      item.classList.toggle("active", item === button),
    );

    syncRoleFields();
  });
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMode = button.dataset.mode;

    modeButtons.forEach((item) =>
      item.classList.toggle("active", item === button),
    );

    syncMode();
  });
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  const user = sinap.getUserByCredentials(selectedRole, email, password);

  if (!user) {
    document.getElementById("loginMessage").textContent =
      "Correo o contraseña incorrectos para el rol seleccionado.";
    return;
  }

  sinap.setSessionForUser(user);

  window.location.href = redirects[selectedRole];
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();

  const email = document
    .getElementById("registerEmail")
    .value.trim()
    .toLowerCase();

  const password = document.getElementById("registerPassword").value.trim();

  const existingUser = sinap.getUserByEmail(selectedRole, email);

  if (existingUser) {
    document.getElementById("registerMessage").textContent =
      "Ya existe un perfil registrado con ese correo para este rol.";
    return;
  }

  const user = {
    role: selectedRole,
    name,
    email,
    password,
  };

  if (selectedRole === "estudiante") {
    user.carrera = document.getElementById("registerCareer").value.trim();

    user.docenteCorreo = registerTeacher.value;
  }

  if (selectedRole === "docente") {
    user.carreras = sinap.parseCareers(
      document.getElementById("registerCareers").value,
    );
  }

  const savedUser = sinap.saveUser(user);

  if (selectedRole === "estudiante") {
    sinap.saveStudent({
      nombre: savedUser.name,
      correo: savedUser.email,
      carrera: savedUser.carrera,
      docenteCorreo: savedUser.docenteCorreo,
      necesidades: [],
      detalles: "",
    });
  }

  sinap.setSessionForUser(savedUser);

  window.location.href = redirects[selectedRole];
});

syncRoleFields();
syncMode();
