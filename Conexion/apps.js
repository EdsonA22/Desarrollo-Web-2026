// FIREBASE

import { db } from "./firebase.js";
console.log(db);

import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// GUARDAR ESTUDIANTE

async function saveStudent(student) {
  try {
    const studentId = String(student.correo || Date.now())
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_");

    await setDoc(doc(db, "estudiantes", studentId), {
      nombre: student.nombre,
      correo: student.correo,
      carrera: student.carrera,
      seccion: student.seccion,
      periodo: student.periodo,
      docenteCorreo: student.docenteCorreo || "",
      necesidades: student.necesidades,
      detalles: student.detalles,
      updatedAt: new Date().toISOString(),
    }, {
      merge: true,
    });

    return true;
  } catch (error) {
    console.error("Error al guardar:", error);
    return false;
  }
}

// OBTENER ESTUDIANTES

async function getStudents() {
  const querySnapshot = await getDocs(collection(db, "estudiantes"));

  const students = [];

  querySnapshot.forEach((doc) => {
    students.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return students;
}

// Exportar funciones globales
window.sinapFirebase = {
  saveStudent,
  getStudents,
};
