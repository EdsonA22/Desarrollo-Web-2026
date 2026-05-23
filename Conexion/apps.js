
// FIREBASE

import { db } from './firebase.js';
console.log(db);

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// GUARDAR ESTUDIANTE


async function saveStudent(student) {

  try {

    await addDoc(collection(db, "estudiantes"), {

      nombre: student.nombre,
      correo: student.correo,
      carrera: student.carrera,
      necesidades: student.necesidades,
      detalles: student.detalles,
      createdAt: new Date().toISOString()

    });

    alert("Estudiante guardado correctamente");

  } catch (error) {

    console.error("Error al guardar:", error);

  }
}

// OBTENER ESTUDIANTES


async function getStudents() {

  const querySnapshot = await getDocs(collection(db, "estudiantes"));

  const students = [];

  querySnapshot.forEach((doc) => {

    students.push({
      id: doc.id,
      ...doc.data()
    });

  });

  return students;
}

// Exportar funciones globales
window.sinap = {

  saveStudent,
  getStudents

};