const session = sinap.requireRole(["admin"]);
if (session) document.getElementById("sessionName").textContent = session.name;
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

const search = document.getElementById("search");
const table = document.getElementById("studentTable");

function renderTable() {
  const term = search.value.toLowerCase();
  const rows = sinap
    .getStudents()
    .filter((student) =>
      `${student.nombre} ${student.correo} ${student.carrera}`
        .toLowerCase()
        .includes(term),
    );
  table.innerHTML = rows
    .map(
      (student) => `
          <tr>
            <td><strong>${student.nombre}</strong><br><span class="muted">${student.correo}</span></td>
            <td>${student.carrera}</td>
            <td>${sinap
              .formatNeeds(student.necesidades)
              .map((need) => `<span class="badge">${need}</span>`)
              .join("")}</td>
            <td><button class="danger-btn" type="button" data-delete="${student.id}">Eliminar</button></td>
          </tr>
        `,
    )
    .join("");
}

search.addEventListener("input", renderTable);
table.addEventListener("click", (event) => {
  if (!event.target.matches("[data-delete]")) return;
  sinap.deleteStudent(event.target.dataset.delete);
  renderTable();
});
renderTable();
