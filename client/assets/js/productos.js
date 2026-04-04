// =====================================================
// PRODUCTOS.JS - GESTIÓN DE PRODUCTOS Y CATÁLOGO
// =====================================================
// Este archivo maneja:
// - Carga de productos desde JSON
// - Filtrado por categorías
// - Renderización de productos en las páginas
// - Interacción con el carrito
// =====================================================

// =====================
// VARIABLES GLOBALES
// =====================
let todosLosProductos = [];

// =====================
// FUNCIÓN PARA CARGAR PRODUCTOS DESDE JSON
// =====================
/**
 * Carga los productos desde el archivo JSON
 * @returns {Array} Array de productos cargados
 */
async function cargarProductos() {
    try {
        const response = await fetch('../data/productos.json');
        
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        
        const data = await response.json();
        todosLosProductos = data.productos;
        
        return todosLosProductos;
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar los productos. Por favor, recarga la página.');
        return [];
    }
}

// =====================
// FUNCIÓN PARA OBTENER PRODUCTOS POR CATEGORÍA
// =====================
/**
 * Filtra productos por categoría
 * @param {String} categoria - Nombre de la categoría a filtrar
 * @returns {Array} Array de productos de la categoría
 */
function obtenerProductosPorCategoria(categoria) {
    return todosLosProductos.filter(producto => producto.categoria === categoria);
}

// =====================
// FUNCIÓN PARA OBTENER PRODUCTOS DESTACADOS
// =====================
/**
 * Obtiene todos los productos destacados
 * @param {Number|null} limite - Cantidad máxima de productos a retornar
 * @returns {Array} Array de productos destacados
 */
function obtenerProductosDestacados(limite = null) {
    const destacados = todosLosProductos.filter(producto => producto.destacado);
    return limite ? destacados.slice(0, limite) : destacados;
}

// =====================
// FUNCIÓN PARA OBTENER PRODUCTOS DESTACADOS POR CATEGORÍA
// =====================
/**
 * Obtiene productos destacados de cada categoría
 * @param {Number} limite - Cantidad de productos por categoría
 * @returns {Array} Array de productos destacados por categoría
 */
function obtenerDestacadosPorCategoria(limite = 2) {
    const categorias = ['indumentaria', 'entrenamiento', 'consumibles'];
    const resultado = [];
    
    categorias.forEach(categoria => {
        const productosCategoria = todosLosProductos
            .filter(p => p.categoria === categoria)
            .sort((a, b) => b.precio - a.precio) // Ordenar por precio descendente
            .slice(0, limite);
        
        resultado.push(...productosCategoria);
    });
    
    return resultado;
}

// =====================
// FUNCIÓN PARA CREAR UNA CARD DE PRODUCTO
// =====================
/**
 * Genera el HTML de una card de producto
 * @param {Object} producto - Objeto del producto a renderizar
 * @returns {String} HTML de la card del producto
 */
function crearCardProducto(producto) {
    return `
        <div class="col-md-4">
            <div class="card h-100 shadow-sm">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 250px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <div class="mt-auto">
                        <p class="fw-bold text-success">$${producto.precio.toFixed(2)}</p>
                        
                        <!-- Controles de cantidad -->
                        <div class="d-flex align-items-center justify-content-center mb-3">
                            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, -1)">
                                <strong>-</strong>
                            </button>
                            <span class="mx-3 fw-bold" id="cantidad-${producto.id}">1</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, 1)">
                                <strong>+</strong>
                            </button>
                        </div>
                        
                        <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${producto.id})">
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =====================
// FUNCIÓN PARA RENDERIZAR PRODUCTOS POR CATEGORÍA
// =====================
/**
 * Renderiza los productos de una categoría específica en el contenedor
 * @param {String} categoria - Nombre de la categoría a renderizar
 */
async function renderizarProductos(categoria) {
    const contenedor = document.getElementById('productos-container');
    
    if (!contenedor) {
        console.error('No se encontró el contenedor de productos');
        return;
    }
    
    // Mostrar mensaje de carga
    contenedor.innerHTML = '<div class="col-12 text-center"><p class="text-white">Cargando productos...</p></div>';
    
    // Cargar productos si aún no están cargados
    if (todosLosProductos.length === 0) {
        await cargarProductos();
    }
    
    // Obtener productos de la categoría
    const productos = obtenerProductosPorCategoria(categoria);
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center"><p class="text-white">No hay productos disponibles en esta categoría.</p></div>';
        return;
    }
    
    // Generar las cards
    let productosHTML = '';
    productos.forEach(producto => {
        productosHTML += crearCardProducto(producto);
    });
    
    // Insertar en el contenedor
    contenedor.innerHTML = productosHTML;
}

// =====================
// FUNCIÓN PARA RENDERIZAR PRODUCTOS DESTACADOS (PARA HOME)
// =====================
/**
 * Renderiza productos destacados en la página principal
 * @param {String} contenedorId - ID del contenedor donde renderizar
 * @param {Number} limite - Cantidad de productos por categoría
 */
async function renderizarProductosDestacados(contenedorId = 'productos-destacados', limite = 2) {
    const contenedor = document.getElementById(contenedorId);
    
    if (!contenedor) {
        console.error('No se encontró el contenedor de productos destacados');
        return;
    }
    
    // Mostrar mensaje de carga
    contenedor.innerHTML = '<div class="col-12 text-center"><p class="text-white">Cargando productos destacados...</p></div>';
    
    // Cargar productos si aún no están cargados
    if (todosLosProductos.length === 0) {
        await cargarProductos();
    }
    
    // Obtener productos destacados por categoría
    const productos = obtenerDestacadosPorCategoria(limite);
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center"><p class="text-white">No hay productos destacados disponibles.</p></div>';
        return;
    }
    
    // Generar las cards
    let productosHTML = '';
    productos.forEach(producto => {
        productosHTML += crearCardProducto(producto);
    });
    
    // Insertar en el contenedor
    contenedor.innerHTML = productosHTML;
}

// =====================
// FUNCIONES DE INTERACCIÓN CON EL CARRITO
// =====================

/**
 * Objeto para almacenar las cantidades seleccionadas de cada producto
 * Clave: productoId, Valor: cantidad
 */
const cantidades = {};

/**
 * Cambia la cantidad de un producto en los controles de la interfaz
 * @param {Number} productoId - ID del producto
 * @param {Number} cambio - Cantidad a sumar o restar (1 o -1)
 */
function cambiarCantidad(productoId, cambio) {
    // Inicializar cantidad si no existe
    if (!cantidades[productoId]) {
        cantidades[productoId] = 1;
    }
    
    // Calcular nueva cantidad
    let nuevaCantidad = cantidades[productoId] + cambio;
    
    // No permitir cantidades menores a 1
    if (nuevaCantidad < 1) {
        nuevaCantidad = 1;
    }
    
    // Actualizar cantidad en memoria
    cantidades[productoId] = nuevaCantidad;
    
    // Actualizar en la interfaz
    const elementoCantidad = document.getElementById(`cantidad-${productoId}`);
    if (elementoCantidad) {
        elementoCantidad.textContent = nuevaCantidad;
    }
}

/**
 * Agrega un producto al carrito usando localStorage
 * Verifica que el usuario esté logueado antes de agregar
 * @param {Number} productoId - ID del producto a agregar
 */
function agregarAlCarrito(productoId) {
    // Verificar que el usuario esté logueado
    const usuario = obtenerUsuarioActual();
    if (!usuario) {
        alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
        // Redirigir al login
        const path = window.location.pathname;
        const enPages = path.includes('/pages/');
        window.location.href = enPages ? './login.html' : './pages/login.html';
        return;
    }
    
    // Obtener la cantidad seleccionada (por defecto 1)
    const cantidad = cantidades[productoId] || 1;
    
    // Buscar el producto en la lista
    const producto = todosLosProductos.find(p => p.id === productoId);
    
    if (!producto) {
        alert('❌ Producto no encontrado');
        return;
    }
    
    // Agregar al carrito usando la función de carrito.js
    agregarProductoAlCarrito(producto, cantidad);
    
    // Mostrar mensaje de confirmación
    alert(`✅ ${producto.nombre}\nCantidad: ${cantidad}\nAgregado al carrito correctamente`);
    
    // Resetear la cantidad después de agregar
    cantidades[productoId] = 1;
    const elementoCantidad = document.getElementById(`cantidad-${productoId}`);
    if (elementoCantidad) {
        elementoCantidad.textContent = 1;
    }
    
    // Actualizar contador del carrito en el navbar
    actualizarContadorCarrito();
}

/**
 * Obtiene el usuario actual desde sessionStorage
 * @returns {Object|null} Datos del usuario o null si no hay sesión
 */
function obtenerUsuarioActual() {
    const usuarioJSON = sessionStorage.getItem('usuario');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}