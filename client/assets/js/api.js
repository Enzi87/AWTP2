// =====================================================
// API.JS - COMUNICACIÓN CON EL SERVIDOR
// =====================================================

const BASE_URL = 'http://localhost:3000/api';

// ─── Productos ────────────────────────────────────────
async function getProductos() {
    const res = await fetch(`${BASE_URL}/productos`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
}

async function getProductosByCategoria(categoria) {
    const todos = await getProductos();
    return todos.filter(
        p => p.categoria.toLowerCase() === categoria.toLowerCase() && p.activo
    );
}

// ─── Auth ─────────────────────────────────────────────
async function loginUsuario(email, contrasena) {
    const res = await fetch(`${BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena })
    });
    if (!res.ok) throw new Error('Credenciales incorrectas');
    return res.json();
}

async function registrarUsuario(nombre, apellido, email, contrasena) {
    const res = await fetch(`${BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, contrasena })
    });
    if (!res.ok) throw new Error('Error al registrar usuario');
    return res.json();
}

// ─── Ventas ───────────────────────────────────────────
async function crearVenta(id_usuario, productos) {
    const total = productos.reduce(
        (acc, p) => acc + (p.precio * p.cantidad), 0
    );
    const res = await fetch(`${BASE_URL}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, productos, total })
    });
    if (!res.ok) throw new Error('Error al procesar la compra');
    return res.json();
}