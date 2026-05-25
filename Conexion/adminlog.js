const session = sinap.requireRole(["admin"]);
if (session) document.getElementById("sessionName").textContent = session.name;
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

const search = document.getElementById("search");
const table = document.getElementById("studentTable");
const form = document.getElementById("studentAdminForm");
const message = document.getElementById("studentFormMessage");
const teacherSelect = document.getElementById("studentTeacher");

function renderTeacherOptions(selectedEmail = "") {
  const teachers = sinap.getUsersByRole("docente");
  teacherSelect.innerHTML = `
    <option value="">Sin docente asignado</option>
    ${teachers
      .map(
        (teacher) =>
          `<option value="${sinap.escapeHtml(teacher.email)}" ${
            teacher.email === selectedEmail ? "selected" : ""
          }>${sinap.escapeHtml(teacher.name)}</option>`,
      )
      .join("")}
  `;
}

function resetForm() {
  form.reset();
  document.getElementById("studentEditEmail").value = "";
  document.getElementById("studentEmail").disabled = false;
  document.getElementById("studentPassword").required = true;
  message.textContent = "";
  renderTeacherOptions();
}

function renderTable() {
  const term = search.value.toLowerCase();
  const rows = sinap
    .getStudents()
    .filter((student) =>
      `${student.nombre} ${student.correo} ${student.carrera} ${sinap.getTeacherLabel(student.docenteCorreo)}`
        .toLowerCase()
        .includes(term),
    );

  table.innerHTML = rows.length
    ? rows
        .map(
          (student) => `
          <tr>
            <td><strong>${sinap.escapeHtml(student.nombre)}</strong><br><span class="muted">${sinap.escapeHtml(student.correo)}</span></td>
            <td>${sinap.escapeHtml(student.carrera)}</td>
            <td>${sinap.escapeHtml(sinap.getTeacherLabel(student.docenteCorreo))}</td>
            <td>${sinap
              .formatNeeds(student.necesidades)
              .map(
                (need) =>
                  `<span class="badge">${sinap.escapeHtml(need)}</span>`,
              )
              .join("")}</td>
            <td>
              <button class="secondary-btn" type="button" data-edit="${student.id}">Editar</button>
              <button class="danger-btn" type="button" data-delete="${student.id}">Eliminar</button>
            </td>
          </tr>
        `,
        )
        .join("")
    : `<tr><td colspan="5" class="muted">No hay estudiantes registrados.</td></tr>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const editEmail = document.getElementById("studentEditEmail").value;
  const email = (editEmail || document.getElementById("studentEmail").value)
    .trim()
    .toLowerCase();
  const name = document.getElementById("studentName").value.trim();
  const password = document.getElementById("studentPassword").value.trim();
  const carrera = document.getElementById("studentCareer").value.trim();
  const docenteCorreo = teacherSelect.value;
  const existingUser = sinap.getUserByEmail("estudiante", email);

  sinap.saveUser({
    ...(existingUser || {}),
    role: "estudiante",
    name,
    email,
    password: password || existingUser?.password || "",
    carrera,
    docenteCorreo,
  });

  sinap.saveStudent({
    nombre: name,
    correo: email,
    carrera,
    docenteCorreo,
  });

  resetForm();
  message.textContent = "Estudiante guardado correctamente.";
  renderTable();
});

document
  .getElementById("clearStudentForm")
  .addEventListener("click", resetForm);

search.addEventListener("input", renderTable);
table.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const student = sinap
      .getStudents()
      .find((item) => item.id === editButton.dataset.edit);
    const user = sinap.getUserByEmail("estudiante", student.correo);

    document.getElementById("studentEditEmail").value = student.correo;
    document.getElementById("studentName").value = student.nombre;
    document.getElementById("studentEmail").value = student.correo;
    document.getElementById("studentEmail").disabled = true;
    document.getElementById("studentPassword").value = "";
    document.getElementById("studentPassword").required = false;
    document.getElementById("studentPassword").placeholder = user?.password
      ? "Dejar vacio para conservar la contraseña"
      : "";
    document.getElementById("studentCareer").value = student.carrera;
    renderTeacherOptions(student.docenteCorreo || "");
    message.textContent = "Editando estudiante existente.";
    return;
  }

  if (!deleteButton) return;
  const student = sinap
    .getStudents()
    .find((item) => item.id === deleteButton.dataset.delete);
  if (!student) return;

  sinap.deleteStudent(student.id);
  sinap.deleteUser(student.correo, "estudiante");
  resetForm();
  renderTable();
});

renderTeacherOptions();
renderTable();
