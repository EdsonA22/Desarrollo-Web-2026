const session = sinap.requireRole(["docente", "admin"]);
if (session) document.getElementById("sessionName").textContent = session.name;
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

let selectedStudent = null;
const students = sinap.getStudents();
const recommendationCount = students.reduce(
  (total, student) =>
    total + sinap.getRecommendations(student.necesidades).length,
  0,
);
document.getElementById("metrics").innerHTML = `
        <article class="card metric"><strong>${students.length}</strong><span>Total de estudiantes</span></article>
        <article class="card metric"><strong>${students.filter((student) => student.necesidades.length).length}</strong><span>Con necesidades registradas</span></article>
        <article class="card metric"><strong>${recommendationCount}</strong><span>Recomendaciones generadas</span></article>
      `;

function renderStudents() {
  document.getElementById("studentList").innerHTML = students
    .map(
      (student) => `
          <article class="student-row">
            <div>
              <h4>${student.nombre}</h4>
              <p class="muted">${student.carrera} - ${student.correo}</p>
              <p>${sinap
                .formatNeeds(student.necesidades)
                .map((need) => `<span class="badge">${need}</span>`)
                .join("")}</p>
            </div>
            <button class="btn" type="button" data-id="${student.id}">Ver recomendaciones</button>
          </article>
        `,
    )
    .join("");
}

renderStudents();

document.getElementById("studentList").addEventListener("click", (event) => {
  if (!event.target.matches("[data-id]")) return;
  selectedStudent = students.find(
    (student) => student.id === event.target.dataset.id,
  );
  document.getElementById("modalTitle").textContent = selectedStudent.nombre;
  document.getElementById("modalBody").innerHTML = `
          <p><strong>Carrera:</strong> ${selectedStudent.carrera}</p>
          <p><strong>Correo:</strong> ${selectedStudent.correo}</p>
          <p>${sinap
            .formatNeeds(selectedStudent.necesidades)
            .map((need) => `<span class="badge">${need}</span>`)
            .join("")}</p>
          <h4 style="margin: 18px 0 8px">Ajustes razonables sugeridos</h4>
          <ul>${sinap
            .getRecommendations(selectedStudent.necesidades)
            .map((item) => `<li>${item}</li>`)
            .join("")}</ul>
        `;
  document.getElementById("recommendationModal").classList.add("open");
});

document
  .getElementById("closeModal")
  .addEventListener("click", () =>
    document.getElementById("recommendationModal").classList.remove("open"),
  );
document
  .getElementById("downloadPdf")
  .addEventListener(
    "click",
    () => selectedStudent && sinap.downloadRecommendations(selectedStudent),
  );
