// =====================
// DETECTAR UBICACIÓN Y AJUSTAR RUTAS
// =====================
function obtenerRutasNavbar() {
    // Detectar si estamos en la raíz o en una subcarpeta
    const path = window.location.pathname;
    const enPages = path.includes('/pages/');
    
    if (enPages) {
        // Estamos en pages/ (cat1.html, cat2.html, etc.)
        return {
            home: '../index.html',
            cat1: './cat1.html',
            cat2: './cat2.html',
            cat3: './cat3.html',
            aboutus: './aboutus.html',
            carrito: './carrito.html', // AGREGAR ESTA LÍNEA
            login: './login.html'
        };
    } else {
        // Estamos en la raíz (index.html)
        return {
            home: './index.html',
            cat1: './pages/cat1.html',
            cat2: './pages/cat2.html',
            cat3: './pages/cat3.html',
            aboutus: './pages/aboutus.html',
            carrito: './pages/carrito.html', // AGREGAR ESTA LÍNEA
            login: './pages/login.html'
        };
    }
}

// =====================
// ESTRUCTURA DE DATOS DE PÁGINAS
// =====================
function obtenerPaginasNav() {
    const rutas = obtenerRutasNavbar();
    
    return [
        { url: rutas.home, titulo: 'Home' },
        { url: rutas.cat1, titulo: 'Indumentaria' },
        { url: rutas.cat2, titulo: 'Entrenamiento' },
        { url: rutas.cat3, titulo: 'Consumibles' },
        { url: rutas.aboutus, titulo: 'Acerca de' }
    ];
}

// =====================
// FUNCIÓN PARA GENERAR EL NAVBAR
// =====================
/**
 * Genera dinámicamente el contenido del navbar
 * Adapta los enlaces según si el usuario está logueado o no
 * @param {String} paginaActiva - Nombre de la página actual para resaltarla
 */
function generarNavbar(paginaActiva) {
    // Obtener el contenedor del navbar
    const navbarContainer = document.getElementById('navbarNav');
    
    if (!navbarContainer) {
        console.error('No se encontró el contenedor del navbar');
        return;
    }
    
    // Obtener las páginas con rutas correctas
    const paginasNav = obtenerPaginasNav();
    const rutas = obtenerRutasNavbar();
    
    // Verificar si el usuario está logueado
    const usuario = obtenerUsuarioActual();
    const estaLogueado = usuario !== null;
    
    // Crear la lista de navegación
    let navbarHTML = '<ul class="navbar-nav ms-auto">';
    
    // Agregar cada página al navbar
    paginasNav.forEach(pagina => {
        const isActive = pagina.titulo === paginaActiva ? 'active' : '';
        navbarHTML += `
            <li class="nav-item">
                <a class="nav-link ${isActive}" href="${pagina.url}">${pagina.titulo}</a>
            </li>
        `;
    });
    
    // Agregar el botón del carrito SOLO si está logueado
    if (estaLogueado) {
        navbarHTML += `
            <li class="nav-item">
                <a class="nav-link position-relative" href="${rutas.carrito}" title="Ver carrito">
                    🛒 Carrito
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none" 
                          id="carrito-contador">
                        0
                    </span>
                </a>
            </li>
        `;
        
        // Extraer el nombre de usuario del email (antes del @)
        const nombreUsuario = usuario.email.split('@')[0];
        
        // Mostrar nombre del usuario
        navbarHTML += `
            <li class="nav-item d-flex align-items-center">
                <span class="text-white me-2" id="navbar-usuario">👤 ${nombreUsuario}</span>
            </li>
        `;
        
        // Botón de Logout
        navbarHTML += `
            <li class="nav-item">
                <a class="btn btn-outline-warning ms-2" href="#" onclick="return confirmarLogout()">Logout</a>
            </li>
        `;
    } else {
        // Botón de Login (cuando NO está logueado)
        navbarHTML += `
            <li class="nav-item">
                <a class="btn btn-outline-success ms-2" href="${rutas.login}">Login</a>
            </li>
        `;
    }
    
    navbarHTML += '</ul>';
    
    // Insertar el navbar generado
    navbarContainer.innerHTML = navbarHTML;
}

/**
 * Obtiene el usuario actual desde sessionStorage
 * @returns {Object|null} Datos del usuario o null si no hay sesión
 */
function obtenerUsuarioActual() {
    const usuarioJSON = sessionStorage.getItem('usuario');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

// =====================
// FUNCIÓN PARA CONFIRMAR LOGOUT
// =====================
/**
 * Muestra confirmación antes de cerrar sesión
 * Llama a la función cerrarSesion() de validacion.js
 * @returns {Boolean} false para prevenir navegación del enlace
 */
function confirmarLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?\n\nSe eliminará tu carrito de compras.')) {
        cerrarSesion(); // Esta función está en validacion.js
    }
    return false; // Prevenir navegación del enlace
}

// =====================
// INICIALIZAR NAVBAR AUTOMÁTICAMENTE
// =====================
/**
 * Detecta la página actual y genera el navbar cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Detectar la página actual basándose en el título o URL
    const pageTitle = document.querySelector('title').textContent;
    
    let paginaActiva = 'Home';
    
    if (pageTitle.includes('Indumentaria') || pageTitle.includes('indumentaria')) {
        paginaActiva = 'Indumentaria';
    } else if (pageTitle.includes('Entrenamiento') || pageTitle.includes('entrenamiento')) {
        paginaActiva = 'Entrenamiento';
    } else if (pageTitle.includes('Consumibles') || pageTitle.includes('consumibles')) {
        paginaActiva = 'Consumibles';
    } else if (pageTitle.includes('Acerca')) {
        paginaActiva = 'Acerca de';
    }
    
    generarNavbar(paginaActiva);
});