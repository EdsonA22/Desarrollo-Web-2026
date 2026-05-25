const session = sinap.requireRole(["estudiante"]);
const user = session ? sinap.getUserByEmail("estudiante", session.email) : null;

if (session) {
  document.getElementById("sessionName").textContent = session.name;
  document.getElementById("profileName").textContent = session.name;
  document.getElementById("profileEmail").textContent = session.email;
}
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

if (session) {
  const student = sinap
    .getStudents()
    .find((item) => item.correo === session.email);
  const docente = user?.docenteCorreo
    ? sinap.getTeacherLabel(user.docenteCorreo)
    : "Sin docente asignado";

  document.getElementById("profileStatus").innerHTML = student
    ? `
      <div class="alert success"><strong>Registro activo.</strong> Tus necesidades ya estan guardadas.</div>
      <p><strong>Carrera:</strong> ${sinap.escapeHtml(student.carrera)}</p>
      <p><strong>Docente asignado:</strong> ${sinap.escapeHtml(docente)}</p>
      <p>${sinap
        .formatNeeds(student.necesidades)
        .map((need) => `<span class="badge">${sinap.escapeHtml(need)}</span>`)
        .join("")}</p>
      <p class="muted">${sinap.escapeHtml(student.detalles || "Sin detalles adicionales.")}</p>
    `
    : `
      <div class="alert warning"><strong>Registro pendiente.</strong> Aun no has guardado tus necesidades educativas.</div>
      <p><strong>Docente asignado:</strong> ${sinap.escapeHtml(docente)}</p>
      <a class="btn" href="estudiante.html">Ir al registro</a>
    `;
}
