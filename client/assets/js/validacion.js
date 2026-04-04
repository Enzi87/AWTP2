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
 * @param {Event} event - Evento del formulario
 */
function validateLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validaciones básicas
    if (email === '' || password === '') {
        alert('⚠️ Por favor completa todos los campos');
        return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Por favor ingresa un email válido');
        return false;
    }
    
    // NOTA: Aquí deberías validar contra una base de datos
    // Por ahora, simulamos un login exitoso
    
    // Extraer nombre de usuario del email (antes del @)
    const nombreUsuario = email.split('@')[0];
    
    // Crear objeto de usuario
    const usuario = {
        nombre: nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1), // Capitalizar primera letra
        apellido: 'Demo',
        email: email,
        fechaLogin: new Date().toISOString()
    };
    
    // Guardar usuario en sessionStorage
    guardarUsuario(usuario);
    
    // Mostrar mensaje de éxito
    alert(`✅ ¡Bienvenido ${nombreUsuario}!`);
    
    // Redirigir a la página principal
    redirectToHome();
    
    return false;
}

/**
 * Valida y procesa el formulario de registro
 * @param {Event} event - Evento del formulario
 */
function validateRegister(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const fechaNacimiento = document.getElementById('fecha_nacimiento').value;
    
    // Validar que todos los campos estén completos
    if (nombre === '' || apellido === '' || email === '' || 
        password === '' || fechaNacimiento === '') {
        alert('⚠️ Por favor completa todos los campos');
        return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Por favor ingresa un email válido');
        return false;
    }
    
    // Validar longitud de contraseña
    if (password.length < 6) {
        alert('⚠️ La contraseña debe tener al menos 6 caracteres');
        return false;
    }
    
    // Validar edad mínima (18 años)
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
    
    // NOTA: Aquí deberías enviar los datos al servidor para crear la cuenta
    // Por ahora, simulamos un registro exitoso
    
    // Mostrar mensaje de éxito
    alert('✅ Registro exitoso!\n\nAhora puedes iniciar sesión con tu email y contraseña');
    
    // Redirigir al login
    redirectToLogin();
    
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