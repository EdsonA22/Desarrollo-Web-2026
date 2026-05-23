const session = sinap.requireRole(["docente", "admin"]);
if (session) {
  document.getElementById("sessionName").textContent = session.name;
  document.getElementById("sessionRole").textContent =
    session.role === "docente" ? "Panel docente" : "Panel administrador";
  document.getElementById("roleNav").innerHTML =
    session.role === "docente"
      ? `<a href="docentes.html">Mis estudiantes</a><a class="active" href="reportes.html">Reportes</a>`
      : `<a href="estudiantes.html">Estudiantes</a><a href="docentes.html">Docentes</a><a class="active" href="reportes.html">Reportes</a>`;
}
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

const students = sinap.getStudents();
const recommendations = students.reduce(
  (total, student) =>
    total + sinap.getRecommendations(student.necesidades).length,
  0,
);
document.getElementById("kpis").innerHTML = `
        <article class="card metric"><strong>${Math.max(150, students.length)}</strong><span>Total estudiantes - +12%</span></article>
        <article class="card metric"><strong>${Math.max(324, recommendations)}</strong><span>Recomendaciones</span></article>
        <article class="card metric"><strong>18</strong><span>Docentes activos</span></article>
        <article class="card metric"><strong>94%</strong><span>Tasa de inclusion</span></article>
      `;

const careers = students.reduce((acc, student) => {
  acc[student.carrera] = (acc[student.carrera] || 0) + 1;
  return acc;
}, {});
const max = Math.max(...Object.values(careers), 1);
document.getElementById("careerBars").innerHTML = Object.entries(careers)
  .map(
    ([career, count]) => `
        <div class="bar"><span>${career}</span><span style="width:${Math.max(24, (count / max) * 100)}%"></span><strong>${count}</strong></div>
      `,
  )
  .join("");
