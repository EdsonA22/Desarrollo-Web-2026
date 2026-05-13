    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

<<<<<<< HEAD
    //AQUI ESTAN LOS DATOS DEL FIREBASE QUE CREE
=======
    // ⚠️ AQUI ESTAN LOS DATOS DEL FIREBASE QUE CREE
>>>>>>> b67c19a9b5e508f0c13cfcd359bf303391bd790f
    const firebaseConfig = {
        apiKey: "AIzaSyBAj-0ii_ok1P50SkMLklKGC2oMuQoJd1o",
        authDomain: "sinap-6dfb5.firebaseapp.com",
        projectId: "sinap-6dfb5",
    };

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Login
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, correo, password);
            alert("Inicio de sesión exitoso");

            // Redirigir
            window.location.href = "index.html";

        } catch (error) {
            alert("Error: " + error.message);
        }
    });