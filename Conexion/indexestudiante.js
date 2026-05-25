const session = sinap.requireRole(["estudiante"]);
const user = session ? sinap.getUserByEmail("estudiante", session.email) : null;

if (session) document.getElementById("sessionName").textContent = session.name;
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

const form = document.getElementById("needsForm");
const result = document.getElementById("recommendationResult");
const careerInput = document.getElementById("carrera");
const accountSummary = document.getElementById("accountSummary");

if (user) {
  careerInput.value = user.carrera || "";
  accountSummary.innerHTML = `
    <strong>Datos de la cuenta</strong>
    <span>${sinap.escapeHtml(user.name)}</span>
    <span>${sinap.escapeHtml(user.email)}</span>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const carrera = data.get("carrera").trim();
  const currentUser = sinap.getUserByEmail("estudiante", session.email) ||
    user || {
      name: session.name,
      email: session.email,
      docenteCorreo: "",
    };

  const savedUser = sinap.saveUser({
    ...currentUser,
    role: "estudiante",
    name: currentUser.name,
    email: currentUser.email,
    carrera,
    docenteCorreo: currentUser.docenteCorreo || "",
  });

  const student = sinap.saveStudent({
    nombre: savedUser.name,
    correo: savedUser.email,
    carrera,
    necesidades: data.getAll("necesidades"),
    detalles: data.get("detalles"),
  });

  result.innerHTML = `
    <div class="alert success"><strong>Informacion guardada.</strong> Se generaron ${sinap.getRecommendations(student.necesidades).length} recomendaciones iniciales.</div>
    <ul>${sinap
      .getRecommendations(student.necesidades)
      .map((item) => `<li>${sinap.escapeHtml(item)}</li>`)
      .join("")}</ul>
  `;
});
