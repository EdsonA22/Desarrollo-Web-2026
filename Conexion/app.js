const STORAGE_KEY = "sinapStudents";
const USER_STORAGE_KEY = "sinapUsers";

const labels = {
  visual: "Discapacidad Visual",
  auditiva: "Discapacidad Auditiva",
  cognitiva: "Discapacidad Cognitiva",
  motora: "Discapacidad Motora",
  neuro: "Neurodivergencia",
};

const rules = {
  visual: [
    "Entregar materiales digitales accesibles con texto ampliado de 14 a 16 pt.",
    "Permitir el uso de lectores de pantalla o magnificadores.",
    "Describir verbalmente imagenes, graficas y contenido proyectado.",
    "Ofrecer ubicacion preferencial con buena iluminacion.",
  ],
  auditiva: [
    "Dar instrucciones importantes por escrito y confirmar su comprension.",
    "Usar subtitulos, transcripciones o apoyos visuales en videos.",
    "Mantener contacto visual al hablar y evitar cubrirse la boca.",
    "Compartir presentaciones y acuerdos de clase con anticipacion.",
  ],
  cognitiva: [
    "Dividir actividades complejas en pasos claros y verificables.",
    "Usar ejemplos concretos, rubricas y recordatorios visuales.",
    "Permitir pausas breves y tiempo adicional en evaluaciones.",
    "Reducir distractores y priorizar instrucciones esenciales.",
  ],
  motora: [
    "Asegurar accesibilidad fisica al aula y al mobiliario.",
    "Permitir entregas digitales cuando la escritura manual sea una barrera.",
    "Flexibilizar tiempos de traslado y participacion.",
    "Coordinar apoyos para practicas o actividades de laboratorio.",
  ],
  neuro: [
    "Anticipar cambios de agenda y publicar instrucciones por escrito.",
    "Permitir tiempo adicional del 50% en evaluaciones cuando aplique.",
    "Ofrecer opciones de participacion oral, escrita o digital.",
    "Favorecer rutinas claras, retroalimentacion directa y objetivos visibles.",
  ],
};

const sampleUsers = [
  {
    id: "usr-estudiante-demo",
    role: "estudiante",
    name: "Maria Gonzalez Lopez",
    email: "estudiante@universidad.edu",
    password: "estudiante123",
    carrera: "Ingenieria en Sistemas",
    seccion: "A",
    periodo: "2026-1",
    docenteCorreo: "docente@universidad.edu",
  },
  {
    id: "usr-docente-demo",
    role: "docente",
    name: "Dr. Carlos Ramirez",
    email: "docente@universidad.edu",
    password: "docente123",
    carreras: ["Ingenieria en Sistemas", "Administracion"],
  },
  {
    id: "usr-admin-demo",
    role: "admin",
    name: "Admin Sistema",
    email: "admin@universidad.edu",
    password: "admin123",
  },
];

const sampleStudents = [
  {
    id: "st-demo-1",
    nombre: "Maria Gonzalez Lopez",
    correo: "estudiante@universidad.edu",
    carrera: "Ingenieria en Sistemas",
    seccion: "A",
    periodo: "2026-1",
    docenteCorreo: "docente@universidad.edu",
    necesidades: ["visual", "neuro"],
    detalles: "Requiere materiales digitales accesibles y tiempo adicional.",
    createdAt: "2026-05-01",
  },
  {
    id: "st-demo-2",
    nombre: "Sofia Martinez Torres",
    correo: "sofia.martinez@universidad.edu",
    carrera: "Administracion",
    seccion: "B",
    periodo: "2026-1",
    docenteCorreo: "docente@universidad.edu",
    necesidades: ["auditiva"],
    detalles: "Prefiere instrucciones por escrito y apoyos visuales.",
    createdAt: "2026-05-03",
  },
  {
    id: "st-demo-3",
    nombre: "Luis Hernandez Diaz",
    correo: "luis.hernandez@universidad.edu",
    carrera: "Psicologia",
    seccion: "C",
    periodo: "2026-2",
    docenteCorreo: "",
    necesidades: ["cognitiva", "motora"],
    detalles: "Necesita instrucciones por pasos y entregas digitales.",
    createdAt: "2026-05-05",
  },
];

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function parseCareers(value = "") {
  if (Array.isArray(value)) {
    return value.map((career) => career.trim()).filter(Boolean);
  }

  return value
    .split(",")
    .map((career) => career.trim())
    .filter(Boolean);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function readStorage(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedUsers() {
  const existingUsers = readStorage(USER_STORAGE_KEY, null);

  if (!existingUsers) {
    writeStorage(USER_STORAGE_KEY, sampleUsers);
    return;
  }

  let changed = false;
  const mergedUsers = [...existingUsers];

  sampleUsers.forEach((sampleUser) => {
    const exists = mergedUsers.some(
      (user) =>
        user.role === sampleUser.role &&
        normalizeEmail(user.email) === sampleUser.email,
    );

    if (!exists) {
      mergedUsers.push(sampleUser);
      changed = true;
    }
  });

  if (changed) writeStorage(USER_STORAGE_KEY, mergedUsers);
}

function seedStudents() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    writeStorage(STORAGE_KEY, sampleStudents);
  }
}

function getUsers() {
  seedUsers();
  return readStorage(USER_STORAGE_KEY, []);
}

function getUsersByRole(role) {
  return getUsers().filter((user) => user.role === role);
}

function getUserByEmail(role, email) {
  const normalizedEmail = normalizeEmail(email);
  return getUsers().find(
    (user) =>
      user.role === role && normalizeEmail(user.email) === normalizedEmail,
  );
}

function getUserByCredentials(role, email, password) {
  const normalizedEmail = normalizeEmail(email);
  return getUsers().find(
    (user) =>
      user.role === role &&
      normalizeEmail(user.email) === normalizedEmail &&
      user.password === password,
  );
}

function getTeacherLabel(email) {
  const teacher = getUserByEmail("docente", email);
  return teacher ? teacher.name : "Sin docente asignado";
}

function normalizeStudentRecord(student = {}) {
  return {
    ...student,
    nombre: student.nombre || "",
    correo: normalizeEmail(student.correo || ""),
    carrera: student.carrera || "",
    seccion: student.seccion || "Sin seccion",
    periodo: student.periodo || "Sin periodo",
    docenteCorreo: normalizeEmail(student.docenteCorreo || ""),
    docenteNombre: student.docenteNombre || "",
    necesidades: Array.isArray(student.necesidades)
      ? student.necesidades
      : [],
    detalles: student.detalles || "",
  };
}

function saveUser(user) {
  const users = getUsers();
  const email = normalizeEmail(user.email);
  const role = user.role;
  const existingIndex = users.findIndex(
    (item) => item.role === role && normalizeEmail(item.email) === email,
  );
  const previous = existingIndex >= 0 ? users[existingIndex] : {};
  const record = {
    ...previous,
    ...user,
    id: previous.id || `usr-${role}-${Date.now()}`,
    role,
    email,
    name: (user.name || previous.name || email).trim(),
    password: user.password || previous.password || "",
  };

  if (role === "docente") {
    record.carreras = parseCareers(user.carreras || previous.carreras || "");
  }

  if (role === "estudiante") {
    record.carrera = (user.carrera || previous.carrera || "").trim();
    record.seccion = (user.seccion || previous.seccion || "").trim();
    record.periodo = (user.periodo || previous.periodo || "").trim();
    record.docenteCorreo = normalizeEmail(
      Object.prototype.hasOwnProperty.call(user, "docenteCorreo")
        ? user.docenteCorreo
        : previous.docenteCorreo || "",
    );
  }

  if (existingIndex >= 0) {
    users[existingIndex] = record;
  } else {
    users.push(record);
  }

  writeStorage(USER_STORAGE_KEY, users);
  return record;
}

function deleteUser(email, role) {
  const normalizedEmail = normalizeEmail(email);
  writeStorage(
    USER_STORAGE_KEY,
    getUsers().filter(
      (user) =>
        user.role !== role || normalizeEmail(user.email) !== normalizedEmail,
    ),
  );

  if (role === "docente") {
    writeStorage(
      STORAGE_KEY,
      getStudents().map((student) =>
        normalizeEmail(student.docenteCorreo) === normalizedEmail
          ? { ...student, docenteCorreo: "", docenteNombre: "" }
          : student,
      ),
    );
  }
}

function getStudents() {
  seedStudents();
  return readStorage(STORAGE_KEY, []).map(normalizeStudentRecord);
}

function syncStudentWithFirebase(student) {
  if (!window.sinapFirebase?.saveStudent) return;

  window.sinapFirebase.saveStudent(student).catch((error) => {
    console.error("No se pudo sincronizar el estudiante con Firebase:", error);
  });
}

function saveStudent(student) {
  const students = getStudents();
  const email = normalizeEmail(student.correo);
  const existingIndex = students.findIndex(
    (item) => normalizeEmail(item.correo) === email,
  );
  const previous = existingIndex >= 0 ? students[existingIndex] : {};
  const hasTeacher = Object.prototype.hasOwnProperty.call(
    student,
    "docenteCorreo",
  );
  const docenteCorreo = hasTeacher
    ? normalizeEmail(student.docenteCorreo)
    : previous.docenteCorreo || "";
  const teacher = docenteCorreo
    ? getUserByEmail("docente", docenteCorreo)
    : null;
  const record = {
    ...previous,
    ...student,
    id: previous.id || `st-${Date.now()}`,
    nombre: (student.nombre || previous.nombre || "").trim(),
    correo: email,
    carrera: (student.carrera || previous.carrera || "").trim(),
    seccion: (student.seccion || previous.seccion || "").trim(),
    periodo: (student.periodo || previous.periodo || "").trim(),
    docenteCorreo,
    docenteNombre: teacher ? teacher.name : "",
    necesidades: Array.isArray(student.necesidades)
      ? student.necesidades
      : previous.necesidades || [],
    detalles: Object.prototype.hasOwnProperty.call(student, "detalles")
      ? student.detalles
      : previous.detalles || "",
    createdAt: previous.createdAt || new Date().toISOString().slice(0, 10),
  };

  if (existingIndex >= 0) {
    students[existingIndex] = record;
  } else {
    students.push(record);
  }

  writeStorage(STORAGE_KEY, students);
  syncStudentWithFirebase(record);
  return normalizeStudentRecord(record);
}

function deleteStudent(id) {
  writeStorage(
    STORAGE_KEY,
    getStudents().filter((student) => student.id !== id),
  );
}

function getStudentsForTeacher(email) {
  const normalizedEmail = normalizeEmail(email);
  const teacher = getUserByEmail("docente", normalizedEmail);
  const teacherCareers = new Set(teacher?.carreras || []);

  return getStudents().filter(
    (student) =>
      normalizeEmail(student.docenteCorreo) === normalizedEmail ||
      (!student.docenteCorreo && teacherCareers.has(student.carrera)),
  );
}

function getRecommendations(needs = []) {
  const unique = new Set();
  needs.forEach((need) =>
    (rules[need] || []).forEach((item) => unique.add(item)),
  );
  if (!unique.size)
    unique.add(
      "Realizar una entrevista de seguimiento para identificar ajustes razonables personalizados.",
    );
  return [...unique];
}

function formatNeeds(needs = []) {
  return needs.map((need) => labels[need] || need);
}

function createSession(user) {
  const {
    role,
    name,
    email,
    carrera,
    seccion,
    periodo,
    carreras,
    docenteCorreo,
  } = user;
  return { role, name, email, carrera, seccion, periodo, carreras, docenteCorreo };
}

function setSessionForUser(user) {
  const session = createSession(user);
  localStorage.setItem("sinapSession", JSON.stringify(session));
  return session;
}

function requireRole(allowedRoles) {
  const session = JSON.parse(localStorage.getItem("sinapSession") || "null");
  if (!session || !allowedRoles.includes(session.role)) {
    window.location.href = "login.html";
    return null;
  }

  const latestUser = getUserByEmail(session.role, session.email);
  if (!latestUser) return session;

  const freshSession = createSession(latestUser);
  localStorage.setItem("sinapSession", JSON.stringify(freshSession));
  return freshSession;
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
        <p><strong>Estudiante:</strong> ${escapeHtml(student.nombre)}</p>
        <p><strong>Carrera:</strong> ${escapeHtml(student.carrera)}</p>
        <p><strong>Seccion:</strong> ${escapeHtml(student.seccion || "Sin seccion")}</p>
        <p><strong>Periodo:</strong> ${escapeHtml(student.periodo || "Sin periodo")}</p>
        <p><strong>Correo:</strong> ${escapeHtml(student.correo)}</p>
        <p>${formatNeeds(student.necesidades)
          .map((need) => `<span class="tag">${escapeHtml(need)}</span>`)
          .join("")}</p>
        <h2>Recomendaciones pedagogicas</h2>
        <ul>${recommendations
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>
        <div class="note">Estas recomendaciones son orientativas. La informacion es sensible y confidencial; no debe compartirse con personas no autorizadas ni revelar nombres, condiciones o detalles de estudiantes.</div>
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
  getStudentsForTeacher,
  getUsers,
  getUsersByRole,
  getUserByEmail,
  getUserByCredentials,
  getTeacherLabel,
  saveUser,
  deleteUser,
  setSessionForUser,
  getRecommendations,
  formatNeeds,
  requireRole,
  logout,
  downloadRecommendations,
  escapeHtml,
  parseCareers,
};
