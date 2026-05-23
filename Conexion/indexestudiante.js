const session = sinap.requireRole(["estudiante"]);
if (session) document.getElementById("sessionName").textContent = session.name;
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

const form = document.getElementById("needsForm");
const result = document.getElementById("recommendationResult");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const student = sinap.saveStudent({
    nombre: data.get("nombre"),
    correo: data.get("correo"),
    carrera: data.get("carrera"),
    necesidades: data.getAll("necesidades"),
    detalles: data.get("detalles"),
  });
  result.innerHTML = `
          <div class="alert success"><strong>Informacion guardada.</strong> Se generaron ${sinap.getRecommendations(student.necesidades).length} recomendaciones iniciales.</div>
          <ul>${sinap
            .getRecommendations(student.necesidades)
            .map((item) => `<li>${item}</li>`)
            .join("")}</ul>
        `;
});
