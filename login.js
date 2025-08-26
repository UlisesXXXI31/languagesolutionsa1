document.addEventListener("DOMContentLoaded", () => {
    const btnAcceder = document.getElementById('btn-acceder'); // <-- Seleccionar el botón
    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');
    const statusMessage = document.getElementById('status-message');
    const dominioPermitido = "@europaschool.org";

    if (btnAcceder) { // <-- Ahora el "if" comprueba el botón
        btnAcceder.addEventListener('click', async (e) => { // <-- Escuchar el evento 'click'
            e.preventDefault();
            const email = inputEmail.value.trim();
            const password = inputPassword.value;

            // ... el resto de tu código es exactamente igual
            if (!email.endsWith(dominioPermitido)) {
                if (statusMessage) {
                    statusMessage.textContent = `Correo incorrecto: debe terminar en ${dominioPermitido}`;
                    statusMessage.style.color = 'red';
                }
                return;
            }

          // VERSIÓN FINAL CORREGIDA - REEMPLAZA TU BLOQUE TRY...CATCH CON ESTE

try {
    // La URL es el primer argumento, el objeto de opciones es el segundo.
    const response = await fetch('https://ls-api-a1.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // Usamos la forma abreviada
    });

    const data = await response.json();

    // Si la respuesta no es exitosa (ej. error 400), lanza el error que viene de la API.
    if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
    }

    // Tu API devuelve un objeto 'user' con 'id', 'role', etc.
    // Vamos a guardar esa información.
    if (data.user && data.user.id) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('userData', JSON.stringify(data.user));

        // Redirigir según el rol del usuario.
        if (data.user.role === 'student') {
            window.location.href = 'index.html';
        } else if (data.user.role === 'teacher') {
            window.location.href = 'teacher.html';
        }
    } else {
        // Esto previene errores si la API responde con éxito pero sin los datos del usuario.
        throw new Error('Respuesta del servidor inválida.');
    }

} catch (error) {
    console.error("Error al iniciar sesión:", error);
    if (statusMessage) {
        statusMessage.textContent = error.message;
        statusMessage.style.color = 'red';
    }
}
        });
    }
});
