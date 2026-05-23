const session = sinap.requireRole(["estudiante"]);
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
  document.getElementById("profileStatus").innerHTML = student
    ? `
          <div class="alert success"><strong>Registro activo.</strong> Tus necesidades ya estan guardadas.</div>
          <p><strong>Carrera:</strong> ${student.carrera}</p>
          <p>${sinap
            .formatNeeds(student.necesidades)
            .map((need) => `<span class="badge">${need}</span>`)
            .join("")}</p>
          <p class="muted">${student.detalles || "Sin detalles adicionales."}</p>
        `
    : `
          <div class="alert warning"><strong>Registro pendiente.</strong> Aun no has guardado tus necesidades educativas.</div>
          <a class="btn" href="index.html">Ir al registro</a>
        `;
}
