const session = sinap.requireRole(["admin"]);
if (session) {
  document.getElementById("sessionName").textContent = session.name;
  document.getElementById("sessionRole").textContent = "Panel administrador";
  document.getElementById("roleNav").innerHTML =
    `<a href="administrador.html">Estudiantes</a><a href="docentes.html">Docentes</a><a class="active" href="reportes.html">Reportes</a>`;
}
document.getElementById("logoutButton").addEventListener("click", sinap.logout);

const students = sinap.getStudents();

// 1. CORRECCIÓN DE RECOMENDACIONES:
// Utilizamos la variable calculada para imprimir el total real en lugar del total de alumnos
const recommendations = students.reduce(
  (total, student) =>
    total + sinap.getRecommendations(student.necesidades).length,
  0,
);

const inclusionRate = students.length
  ? Math.round(
      (students.filter((student) => student.necesidades.length > 0).length /
        students.length) *
        100,
    )
  : 0;

document.getElementById("kpis").innerHTML = `
  <article class="card metric"><strong>${students.length}</strong><span>Total estudiantes</span></article>
  <article class="card metric"><strong>${recommendations}</strong><span>Recomendaciones generadas</span></article>
  <article class="card metric"><strong>${sinap.getUsersByRole("docente").length}</strong><span>Docentes activos</span></article>
  <article class="card metric"><strong>${inclusionRate}%</strong><span>Tasa de inclusión</span></article>
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

// 2. GRÁFICA DE DISTRIBUCIÓN DE NECESIDADES (Dinámica)
const needsCount = {};
let totalNeeds = 0;

// Extraemos y contamos todas las necesidades de cada estudiante
students.forEach((student) => {
  student.necesidades.forEach((need) => {
    needsCount[need] = (needsCount[need] || 0) + 1;
    totalNeeds++;
  });
});

const donutElement = document.getElementById("needsDonut");
const badgesElement = document.getElementById("needsBadges");

if (donutElement && badgesElement) {
  if (totalNeeds === 0) {
    donutElement.style.background = "#eaf2ff";
    badgesElement.innerHTML = `<span class="muted">Sin datos registrados</span>`;
  } else {
    // Paleta de colores para el gráfico
    const colors = ["#1554d1", "#20a779", "#f2b705", "#d94f4f", "#8b5cf6"];
    let donutGradient = [];
    let badgesHtml = [];
    let currentPercentage = 0;
    let colorIndex = 0;

    for (const [need, count] of Object.entries(needsCount)) {
      const percentage = (count / totalNeeds) * 100;
      const color = colors[colorIndex % colors.length];
      const label = sinap.labels[need] || need; // Traduce la clave al nombre legible

      // Construimos el gradiente cónico para CSS
      donutGradient.push(
        `${color} ${currentPercentage}% ${currentPercentage + percentage}%`,
      );

      // Agregamos una viñeta del color correspondiente en el badge para identificarlo
      badgesHtml.push(
        `<span class="badge" style="border-left: 4px solid ${color}">${label} ${Math.round(percentage)}%</span>`,
      );

      currentPercentage += percentage;
      colorIndex++;
    }

    // Inyectamos el estilo al círculo y el texto al contenedor
    donutElement.style.background = `conic-gradient(${donutGradient.join(", ")})`;
    badgesElement.innerHTML = badgesHtml.join("");
  }
}

// 3. TENDENCIA POR PERIODOS DE LOS ALUMNOS
const periodCount = {};

// Agrupamos la cantidad de alumnos por periodo exacto
students.forEach((student) => {
  const p = student.periodo || "Sin periodo";
  periodCount[p] = (periodCount[p] || 0) + 1;
});

const periodTrendElement = document.getElementById("periodTrend");

if (periodTrendElement) {
  const maxPeriod = Math.max(...Object.values(periodCount), 1);
  const maxPx = 175; // Altura máxima estandarizada en tu CSS original

  const trendHtml = Object.entries(periodCount)
    .map(([period, count]) => {
      // Calculamos la altura de la barra dinámicamente con un mínimo de 30px
      const height = Math.max(30, (count / maxPeriod) * maxPx);
      return `<div style="height: ${height}px" title="${count} estudiantes">${period}</div>`;
    })
    .join("");

  periodTrendElement.innerHTML =
    trendHtml || '<div class="muted">Sin datos</div>';
}
