// =====================================================
// VALIDACION.JS - GESTIÓN DE SESIÓN Y VALIDACIONES
// =====================================================
// Este archivo maneja:
// - Inicio de sesión y guardado en sessionStorage
// - Registro de usuarios
// - Validaciones de formularios
// - Cierre de sesión y limpieza de datos
// =====================================================

// =====================
// FUNCIONES DE SESIÓN
// =====================

/**
 * Guarda los datos del usuario en sessionStorage
 * @param {Object} usuario - Objeto con los datos del usuario
 */
function guardarUsuario(usuario) {
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
}

/**
 * Obtiene los datos del usuario desde sessionStorage
 * @returns {Object|null} Datos del usuario o null si no hay sesión
 */
function obtenerUsuarioActual() {
    const usuarioJSON = sessionStorage.getItem('usuario');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

/**
 * Cierra la sesión del usuario y limpia los datos
 */
function cerrarSesion() {
    // Limpiar sessionStorage (datos del usuario)
    sessionStorage.removeItem('usuario');
    
    // Limpiar localStorage (carrito de compras)
    localStorage.removeItem('carrito');
    
    // Determinar la ruta correcta según la ubicación
    const path = window.location.pathname;
    const enPages = path.includes('/pages/');
    
    // Redirigir al login
    window.location.href = enPages ? './login.html' : './pages/login.html';
}

/**
 * Verifica si hay un usuario logueado
 * @returns {Boolean} true si hay sesión activa
 */
function verificarSesion() {
    return obtenerUsuarioActual() !== null;
}

// =====================
// REDIRECCIONES
// =====================

/**
 * Redirige al usuario a la página principal después del login
 */
function redirectToHome() {
    window.location.href = '../index.html';
}

/**
 * Redirige al usuario al login desde el registro
 */
function redirectToLogin() {
    window.location.href = 'login.html';
}

/**
 * Función para confirmar y ejecutar el logout
 * Se llama desde el botón del navbar
 */
function confirmarLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?\n\nSe eliminará tu carrito de compras.')) {
        cerrarSesion();
    }
    return false; // Prevenir la navegación del enlace
}

// =====================
// VALIDACIÓN DE FORMULARIOS
// =====================

/**
 * Valida y procesa el formulario de login
 
 */
async function validateLogin(event) {
    event.preventDefault();

    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        alert('⚠️ Por favor completa todos los campos');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Por favor ingresa un email válido');
        return false;
    }

    try {
        const data = await loginUsuario(email, password);
        // data.usuario viene del servidor: { id, nombre, apellido, email, ... }
        guardarUsuario(data.usuario);
        alert(`✅ ¡Bienvenido ${data.usuario.nombre}!`);
        redirectToHome();
    } catch (error) {
        alert('❌ Email o contraseña incorrectos');
    }

    return false;
}

/**
 * Valida y procesa el formulario de registro
 
 */
async function validateRegister(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const fechaNacimiento = document.getElementById('fecha_nacimiento').value;

    if (nombre === '' || apellido === '' || email === '' ||
        password === '' || fechaNacimiento === '') {
        alert('⚠️ Por favor completa todos los campos');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Por favor ingresa un email válido');
        return false;
    }

    if (password.length < 6) {
        alert('⚠️ La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    if (edad < 18) {
        alert('⚠️ Debes ser mayor de 18 años para registrarte');
        return false;
    }

    try {
        await registrarUsuario(nombre, apellido, email, password);
        alert('✅ Registro exitoso!\n\nAhora puedes iniciar sesión con tu email y contraseña');
        redirectToLogin();
    } catch (error) {
        alert('❌ Error al registrar. Es posible que el email ya esté en uso.');
    }

    return false;
}

// =====================
// PROTECCIÓN DE PÁGINAS
// =====================

/**
 * Verifica si el usuario está logueado al cargar páginas protegidas
 * Llamar esta función en páginas que requieran autenticación
 */
function verificarAutenticacion() {
    if (!verificarSesion()) {
        alert('⚠️ Debes iniciar sesión para acceder a esta página');
        // Determinar la ruta correcta según la ubicación
        const path = window.location.pathname;
        const enPages = path.includes('/pages/');
        window.location.href = enPages ? './login.html' : './pages/login.html';
    }
}

// =====================
// INICIALIZACIÓN
// =====================

// Ya no necesitamos mostrarUsuarioEnNavbar() porque navbar.js lo maneja
// COMENTADO: Esta función causaba duplicación
/*
function mostrarUsuarioEnNavbar() {
    const usuario = obtenerUsuarioActual();
    
    if (usuario) {
        const logoutBtn = document.querySelector('.btn-outline-warning');
        
        if (logoutBtn) {
            const nombreSpan = document.createElement('span');
            nombreSpan.className = 'text-white me-2';
            nombreSpan.textContent = `👤 ${usuario.nombre}`;
            
            logoutBtn.parentElement.insertBefore(nombreSpan, logoutBtn);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarUsuarioEnNavbar();
});
*/