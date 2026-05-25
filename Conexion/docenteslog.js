const session = sinap.requireRole(["docente", "admin"]);

if (session) {
  document.getElementById("sessionName").textContent = session.name;
  document.getElementById("sessionRole").textContent =
    session.role === "admin" ? "Base de datos" : "Gestion de aula";
  document.getElementById("roleNav").innerHTML =
    session.role === "admin"
      ? `<a href="administrador.html">Estudiantes</a><a class="active" href="docentes.html">Docentes</a><a href="reportes.html">Reportes</a>`
      : `<a class="active" href="docentes.html">Mi perfil</a>`;
}

document.getElementById("logoutButton").addEventListener("click", sinap.logout);

const teacherPanel = document.getElementById("teacherPanel");
const adminTeacherPanel = document.getElementById("adminTeacherPanel");
let selectedStudent = null;

function countAssignedStudents(email) {
  const normalizedEmail = email.toLowerCase();
  return sinap
    .getStudents()
    .filter((student) => student.docenteCorreo === normalizedEmail).length;
}

function renderTeacherDashboard() {
  const teacher = sinap.getUserByEmail("docente", session.email);
  const students = sinap.getStudentsForTeacher(session.email);
  const recommendationCount = students.reduce(
    (total, student) =>
      total + sinap.getRecommendations(student.necesidades).length,
    0,
  );

  document.getElementById("metrics").innerHTML = `
    <article class="card metric"><strong>${students.length}</strong><span>Mis estudiantes</span></article>
    <article class="card metric"><strong>${students.filter((student) => student.necesidades.length).length}</strong><span>Con necesidades registradas</span></article>
    <article class="card metric"><strong>${recommendationCount}</strong><span>Recomendaciones generadas</span></article>
  `;

  document.getElementById("teacherProfile").innerHTML = `
    <p><strong>Nombre:</strong> ${sinap.escapeHtml(teacher?.name || session.name)}</p>
    <p><strong>Correo:</strong> ${sinap.escapeHtml(session.email)}</p>
    <p><strong>Carreras:</strong> ${
      teacher?.carreras?.length
        ? teacher.carreras.map((career) => sinap.escapeHtml(career)).join(", ")
        : "Sin carreras registradas"
    }</p>
  `;

  document.getElementById("studentList").innerHTML = students.length
    ? students
        .map(
          (student) => `
        <article class="student-row">
          <div>
            <h4>${sinap.escapeHtml(student.nombre)}</h4>
            <p class="muted">${sinap.escapeHtml(student.carrera)} - ${sinap.escapeHtml(student.correo)}</p>
            <p>${sinap
              .formatNeeds(student.necesidades)
              .map(
                (need) =>
                  `<span class="badge">${sinap.escapeHtml(need)}</span>`,
              )
              .join("")}</p>
          </div>
          <button class="btn" type="button" data-id="${student.id}">Ver recomendaciones</button>
        </article>
      `,
        )
        .join("")
    : `<div class="alert warning"><strong>Sin alumnos asignados.</strong> El administrador debe asignar estudiantes desde la base de datos.</div>`;
}

function renderTeacherTable() {
  const term = document.getElementById("teacherSearch").value.toLowerCase();
  const teachers = sinap
    .getUsersByRole("docente")
    .filter((teacher) =>
      `${teacher.name} ${teacher.email} ${(teacher.carreras || []).join(" ")}`
        .toLowerCase()
        .includes(term),
    );

  document.getElementById("teacherTable").innerHTML = teachers.length
    ? teachers
        .map(
          (teacher) => `
          <tr>
            <td><strong>${sinap.escapeHtml(teacher.name)}</strong><br><span class="muted">${sinap.escapeHtml(teacher.email)}</span></td>
            <td>${(teacher.carreras || [])
              .map(
                (career) =>
                  `<span class="badge">${sinap.escapeHtml(career)}</span>`,
              )
              .join("")}</td>
            <td>${countAssignedStudents(teacher.email)}</td>
            <td>
              <button class="secondary-btn" type="button" data-edit-teacher="${sinap.escapeHtml(teacher.email)}">Editar</button>
              <button class="danger-btn" type="button" data-delete-teacher="${sinap.escapeHtml(teacher.email)}">Eliminar</button>
            </td>
          </tr>
        `,
        )
        .join("")
    : `<tr><td colspan="4" class="muted">No hay docentes registrados.</td></tr>`;
}

function resetTeacherForm() {
  document.getElementById("teacherAdminForm").reset();
  document.getElementById("teacherEditEmail").value = "";
  document.getElementById("teacherEmail").disabled = false;
  document.getElementById("teacherPassword").required = true;
  document.getElementById("teacherPassword").placeholder = "";
  document.getElementById("teacherFormMessage").textContent = "";
}

function setupAdminTeachers() {
  teacherPanel.hidden = true;
  adminTeacherPanel.hidden = false;

  document
    .getElementById("teacherAdminForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const editEmail = document.getElementById("teacherEditEmail").value;
      const email = (editEmail || document.getElementById("teacherEmail").value)
        .trim()
        .toLowerCase();
      const existingUser = sinap.getUserByEmail("docente", email);

      sinap.saveUser({
        ...(existingUser || {}),
        role: "docente",
        name: document.getElementById("teacherName").value.trim(),
        email,
        password:
          document.getElementById("teacherPassword").value.trim() ||
          existingUser?.password ||
          "",
        carreras: sinap.parseCareers(
          document.getElementById("teacherCareers").value,
        ),
      });

      resetTeacherForm();
      document.getElementById("teacherFormMessage").textContent =
        "Docente guardado correctamente.";
      renderTeacherTable();
    });

  document
    .getElementById("clearTeacherForm")
    .addEventListener("click", resetTeacherForm);

  document
    .getElementById("teacherSearch")
    .addEventListener("input", renderTeacherTable);

  document.getElementById("teacherTable").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-teacher]");
    const deleteButton = event.target.closest("[data-delete-teacher]");

    if (editButton) {
      const teacher = sinap.getUserByEmail(
        "docente",
        editButton.dataset.editTeacher,
      );
      if (!teacher) return;

      document.getElementById("teacherEditEmail").value = teacher.email;
      document.getElementById("teacherName").value = teacher.name;
      document.getElementById("teacherEmail").value = teacher.email;
      document.getElementById("teacherEmail").disabled = true;
      document.getElementById("teacherPassword").value = "";
      document.getElementById("teacherPassword").required = false;
      document.getElementById("teacherPassword").placeholder =
        "Dejar vacio para conservar la contraseña";
      document.getElementById("teacherCareers").value = (
        teacher.carreras || []
      ).join(", ");
      document.getElementById("teacherFormMessage").textContent =
        "Editando docente existente.";
      return;
    }

    if (!deleteButton) return;
    sinap.deleteUser(deleteButton.dataset.deleteTeacher, "docente");
    resetTeacherForm();
    renderTeacherTable();
  });

  renderTeacherTable();
}

function setupTeacherStudents() {
  teacherPanel.hidden = false;
  adminTeacherPanel.hidden = true;
  renderTeacherDashboard();

  document.getElementById("studentList").addEventListener("click", (event) => {
    if (!event.target.matches("[data-id]")) return;
    selectedStudent = sinap
      .getStudentsForTeacher(session.email)
      .find((student) => student.id === event.target.dataset.id);
    if (!selectedStudent) return;

    document.getElementById("modalTitle").textContent = selectedStudent.nombre;
    document.getElementById("modalBody").innerHTML = `
      <p><strong>Carrera:</strong> ${sinap.escapeHtml(selectedStudent.carrera)}</p>
      <p><strong>Correo:</strong> ${sinap.escapeHtml(selectedStudent.correo)}</p>
      <p>${sinap
        .formatNeeds(selectedStudent.necesidades)
        .map((need) => `<span class="badge">${sinap.escapeHtml(need)}</span>`)
        .join("")}</p>
      <h4 style="margin: 18px 0 8px">Ajustes razonables sugeridos</h4>
      <ul>${sinap
        .getRecommendations(selectedStudent.necesidades)
        .map((item) => `<li>${sinap.escapeHtml(item)}</li>`)
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
}

if (session?.role === "admin") {
  setupAdminTeachers();
} else if (session?.role === "docente") {
  setupTeacherStudents();
}
