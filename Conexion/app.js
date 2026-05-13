const STORAGE_KEY = "sinapStudents";

const sampleStudents = [
  {
    id: "st-1",
    nombre: "Maria Gonzalez Lopez",
    correo: "maria.gonzalez@universidad.edu",
    carrera: "Ingenieria de Sistemas",
    necesidades: ["visual", "neuro"],
    detalles: "Necesito material digital, texto ampliado y tiempo extra en evaluaciones.",
    createdAt: "2026-04-09"
  },
  {
    id: "st-2",
    nombre: "Jose Martinez Perez",
    correo: "jose.martinez@universidad.edu",
    carrera: "Psicologia",
    necesidades: ["auditiva"],
    detalles: "Requiero instrucciones por escrito y apoyo visual durante exposiciones.",
    createdAt: "2026-04-10"
  },
  {
    id: "st-3",
    nombre: "Ana Sofia Hernandez",
    correo: "ana.hernandez@universidad.edu",
    carrera: "Medicina",
    necesidades: ["cognitiva", "neuro"],
    detalles: "Me ayuda recibir instrucciones claras, listas paso a paso y descansos breves.",
    createdAt: "2026-04-11"
  }
];

const labels = {
  visual: "Discapacidad Visual",
  auditiva: "Discapacidad Auditiva",
  cognitiva: "Discapacidad Cognitiva",
  motora: "Discapacidad Motora",
  neuro: "Neurodivergencia"
};

const rules = {
  visual: [
    "Entregar materiales digitales accesibles con texto ampliado de 14 a 16 pt.",
    "Permitir el uso de lectores de pantalla o magnificadores.",
    "Describir verbalmente imagenes, graficas y contenido proyectado.",
    "Ofrecer ubicacion preferencial con buena iluminacion."
  ],
  auditiva: [
    "Dar instrucciones importantes por escrito y confirmar su comprension.",
    "Usar subtitulos, transcripciones o apoyos visuales en videos.",
    "Mantener contacto visual al hablar y evitar cubrirse la boca.",
    "Compartir presentaciones y acuerdos de clase con anticipacion."
  ],
  cognitiva: [
    "Dividir actividades complejas en pasos claros y verificables.",
    "Usar ejemplos concretos, rubricas y recordatorios visuales.",
    "Permitir pausas breves y tiempo adicional en evaluaciones.",
    "Reducir distractores y priorizar instrucciones esenciales."
  ],
  motora: [
    "Asegurar accesibilidad fisica al aula y al mobiliario.",
    "Permitir entregas digitales cuando la escritura manual sea una barrera.",
    "Flexibilizar tiempos de traslado y participacion.",
    "Coordinar apoyos para practicas o actividades de laboratorio."
  ],
  neuro: [
    "Anticipar cambios de agenda y publicar instrucciones por escrito.",
    "Permitir tiempo adicional del 50% en evaluaciones cuando aplique.",
    "Ofrecer opciones de participacion oral, escrita o digital.",
    "Favorecer rutinas claras, retroalimentacion directa y objetivos visibles."
  ]
};

function seedStudents() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleStudents));
  }
}

function getStudents() {
  seedStudents();
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveStudent(student) {
  const students = getStudents();
  const existingIndex = students.findIndex((item) => item.correo === student.correo);
  const record = {
    ...student,
    id: existingIndex >= 0 ? students[existingIndex].id : `st-${Date.now()}`,
    createdAt: existingIndex >= 0 ? students[existingIndex].createdAt : new Date().toISOString().slice(0, 10)
  };

  if (existingIndex >= 0) {
    students[existingIndex] = record;
  } else {
    students.push(record);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  return record;
}

function deleteStudent(id) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getStudents().filter((student) => student.id !== id)));
}

function getRecommendations(needs = []) {
  const unique = new Set();
  needs.forEach((need) => (rules[need] || []).forEach((item) => unique.add(item)));
  if (!unique.size) unique.add("Realizar una entrevista de seguimiento para identificar ajustes razonables personalizados.");
  return [...unique];
}

function formatNeeds(needs = []) {
  return needs.map((need) => labels[need] || need);
}

function requireRole(allowedRoles) {
  const session = JSON.parse(localStorage.getItem("sinapSession") || "null");
  if (!session || !allowedRoles.includes(session.role)) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

function logout() {
  localStorage.removeItem("sinapSession");
  window.location.href = "login.html";
}

function downloadRecommendations(student) {
  const recommendations = getRecommendations(student.necesidades);
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html lang="es">
      <head>
        <title>Recomendaciones SINAP</title>
        <style>
          body { font-family: Arial, sans-serif; color: #172033; line-height: 1.5; padding: 32px; }
          h1 { color: #1554d1; }
          .tag { display: inline-block; border: 1px solid #1554d1; border-radius: 999px; padding: 4px 10px; margin: 3px; color: #1554d1; }
          .note { background: #fff7d6; border-left: 5px solid #c98600; padding: 12px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <h1>SINAP - Ajustes razonables</h1>
        <p><strong>Estudiante:</strong> ${student.nombre}</p>
        <p><strong>Carrera:</strong> ${student.carrera}</p>
        <p><strong>Correo:</strong> ${student.correo}</p>
        <p>${formatNeeds(student.necesidades).map((need) => `<span class="tag">${need}</span>`).join("")}</p>
        <h2>Recomendaciones pedagogicas</h2>
        <ul>${recommendations.map((item) => `<li>${item}</li>`).join("")}</ul>
        <div class="note">Estas recomendaciones son orientativas, confidenciales y deben adaptarse al contexto de cada asignatura.</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

window.sinap = {
  labels,
  seedStudents,
  getStudents,
  saveStudent,
  deleteStudent,
  getRecommendations,
  formatNeeds,
  requireRole,
  logout,
  downloadRecommendations
};
