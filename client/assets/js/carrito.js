// =====================================================
// CARRITO.JS - GESTIÓN DEL CARRITO DE COMPRAS
// =====================================================
// Este archivo maneja toda la lógica del carrito:
// - Agregar productos al localStorage
// - Obtener productos del carrito
// - Actualizar cantidades
// - Eliminar productos
// - Calcular totales
// - Renderizar la vista del carrito
// =====================================================

// =====================
// FUNCIONES DE LOCALSTORAGE
// =====================

/**
 * Obtiene el carrito completo desde localStorage
 * @returns {Array} Array de productos en el carrito
 */
function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

/**
 * Guarda el carrito en localStorage
 * @param {Array} carrito - Array de productos a guardar
 */
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Actualizar el contador del navbar si existe
    actualizarContadorCarrito();
}

/**
 * Agrega un producto al carrito o actualiza su cantidad si ya existe
 * @param {Object} producto - Objeto del producto a agregar
 * @param {Number} cantidad - Cantidad a agregar
 */
function agregarProductoAlCarrito(producto, cantidad) {
    let carrito = obtenerCarrito();
    
    // Buscar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        // Si existe, actualizar la cantidad
        productoExistente.cantidad += cantidad;
    } else {
        // Si no existe, agregarlo con la cantidad especificada
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad
        });
    }
    
    guardarCarrito(carrito);
}

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {Number} productoId - ID del producto
 * @param {Number} nuevaCantidad - Nueva cantidad del producto
 */
function actualizarCantidadCarrito(productoId, nuevaCantidad) {
    let carrito = obtenerCarrito();
    
    // Buscar el producto en el carrito
    const producto = carrito.find(item => item.id === productoId);
    
    if (producto) {
        if (nuevaCantidad <= 0) {
            // Si la cantidad es 0 o menor, eliminar el producto
            eliminarProductoDelCarrito(productoId);
        } else {
            // Actualizar la cantidad
            producto.cantidad = nuevaCantidad;
            guardarCarrito(carrito);
            
            // Si estamos en la página del carrito, actualizar la vista
            if (document.getElementById('carrito-productos')) {
                renderizarCarrito();
            }
        }
    }
}

/**
 * Elimina un producto del carrito
 * @param {Number} productoId - ID del producto a eliminar
 */
function eliminarProductoDelCarrito(productoId) {
    let carrito = obtenerCarrito();
    
    // Filtrar el carrito para eliminar el producto
    carrito = carrito.filter(item => item.id !== productoId);
    
    guardarCarrito(carrito);
    
    // Si estamos en la página del carrito, actualizar la vista
    if (document.getElementById('carrito-productos')) {
        renderizarCarrito();
    }
}

/**
 * Vacía completamente el carrito
 */
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        actualizarContadorCarrito();
        
        // Si estamos en la página del carrito, actualizar la vista
        if (document.getElementById('carrito-productos')) {
            renderizarCarrito();
        }
    }
}

/**
 * Obtiene la cantidad total de productos en el carrito
 * @returns {Number} Cantidad total de productos
 */
function obtenerCantidadTotalCarrito() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

/**
 * Calcula el total en dinero del carrito
 * @returns {Number} Total del carrito
 */
function calcularTotalCarrito() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// =====================
// FUNCIONES DE RENDERIZADO
// =====================

/**
 * Renderiza todos los productos del carrito en la página
 */
function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('carrito-productos');
    const carritoVacio = document.getElementById('carrito-vacio');
    const btnFinalizar = document.getElementById('btn-finalizar');
    
    if (!contenedor) return;
    
    // Si el carrito está vacío, mostrar mensaje
    if (carrito.length === 0) {
        contenedor.parentElement.parentElement.classList.add('d-none');
        document.querySelector('.col-lg-4').classList.add('d-none');
        carritoVacio.classList.remove('d-none');
        return;
    }
    
    // Ocultar mensaje de carrito vacío
    contenedor.parentElement.parentElement.classList.remove('d-none');
    document.querySelector('.col-lg-4').classList.remove('d-none');
    carritoVacio.classList.add('d-none');
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Renderizar cada producto
    carrito.forEach(producto => {
        const productoHTML = crearItemCarrito(producto);
        contenedor.innerHTML += productoHTML;
    });
    
    // Actualizar resumen
    actualizarResumenCarrito();
    
    // Habilitar botón de finalizar compra
    if (btnFinalizar) {
        btnFinalizar.disabled = false;
    }
}

/**
 * Crea el HTML para un item del carrito
 * @param {Object} producto - Producto a renderizar
 * @returns {String} HTML del item
 */
function crearItemCarrito(producto) {
    const subtotal = (producto.precio * producto.cantidad).toFixed(2);
    
    return `
        <div class="row border-bottom py-3 align-items-center" id="item-${producto.id}">
            <!-- Imagen del producto -->
            <div class="col-md-2 col-3">
                <img src="${producto.imagen}" class="img-fluid rounded" alt="${producto.nombre}">
            </div>
            
            <!-- Información del producto -->
            <div class="col-md-4 col-9">
                <h6 class="mb-1">${producto.nombre}</h6>
                <small class="text-muted">Precio unitario: $${producto.precio.toFixed(2)}</small>
            </div>
            
            <!-- Controles de cantidad -->
            <div class="col-md-3 col-6 mt-2 mt-md-0">
                <div class="input-group input-group-sm">
                    <button class="btn btn-outline-secondary" type="button" 
                            onclick="cambiarCantidadCarrito(${producto.id}, -1)">
                        <strong>−</strong>
                    </button>
                    <input type="text" class="form-control text-center" 
                           value="${producto.cantidad}" 
                           id="cantidad-carrito-${producto.id}" 
                           readonly>
                    <button class="btn btn-outline-secondary" type="button" 
                            onclick="cambiarCantidadCarrito(${producto.id}, 1)">
                        <strong>+</strong>
                    </button>
                </div>
            </div>
            
            <!-- Subtotal y botón eliminar -->
            <div class="col-md-2 col-4 mt-2 mt-md-0 text-end">
                <strong class="text-success">$${subtotal}</strong>
            </div>
            <div class="col-md-1 col-2 mt-2 mt-md-0 text-end">
                <button class="btn btn-sm btn-outline-danger" 
                        onclick="eliminarProductoDelCarrito(${producto.id})"
                        title="Eliminar producto">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

/**
 * Cambia la cantidad de un producto en el carrito
 * @param {Number} productoId - ID del producto
 * @param {Number} cambio - Cantidad a sumar o restar
 */
function cambiarCantidadCarrito(productoId, cambio) {
    const carrito = obtenerCarrito();
    const producto = carrito.find(item => item.id === productoId);
    
    if (producto) {
        const nuevaCantidad = producto.cantidad + cambio;
        actualizarCantidadCarrito(productoId, nuevaCantidad);
    }
}

/**
 * Actualiza el resumen del carrito (totales)
 */
function actualizarResumenCarrito() {
    const carrito = obtenerCarrito();
    const cantidadTotal = obtenerCantidadTotalCarrito();
    const total = calcularTotalCarrito();
    
    // Actualizar elementos del DOM
    const subtotalElement = document.getElementById('subtotal');
    const totalProductosElement = document.getElementById('total-productos');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    if (totalProductosElement) totalProductosElement.textContent = cantidadTotal;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Actualiza el contador de productos en el navbar
 */
function actualizarContadorCarrito() {
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        const cantidad = obtenerCantidadTotalCarrito();
        contador.textContent = cantidad;
        
        // Mostrar u ocultar el badge según la cantidad
        if (cantidad > 0) {
            contador.classList.remove('d-none');
        } else {
            contador.classList.add('d-none');
        }
    }
}

// =====================
// INICIALIZACIÓN
// =====================

/**
 * Inicializa la página del carrito cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página del carrito
    if (document.getElementById('carrito-productos')) {
        // Verificar que el usuario esté logueado
        const usuario = obtenerUsuarioActual();
        if (!usuario) {
            alert('Debes iniciar sesión para ver tu carrito');
            window.location.href = './login.html';
            return;
        }
        
        // Mostrar nombre del usuario
        const usuarioNombre = document.getElementById('usuario-nombre');
        if (usuarioNombre) {
            usuarioNombre.textContent = `Hola, ${usuario.nombre} ${usuario.apellido}`;
        }
        
        // Renderizar el carrito
        renderizarCarrito();
    }
    
    // Actualizar contador en todas las páginas
    actualizarContadorCarrito();
});

/**
 * Función para obtener el usuario actual desde sessionStorage
 * (Esta función se definirá también en validacion.js)
 * @returns {Object|null} Datos del usuario o null
 */
function obtenerUsuarioActual() {
    const usuarioJSON = sessionStorage.getItem('usuario');
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}