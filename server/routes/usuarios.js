const express = require("express");
const router = express.Router();
const { leerUsuarios, guardarUsuarios } = require("../functions/usuarios");
const { leerVentas, guardarVentas } = require("../functions/ventas");

// GET - obtener todos los usuarios
router.get("/", (req, res) => {
  const usuarios = leerUsuarios();
  res.status(200).json(usuarios);
});

// GET - obtener un usuario por ID
router.get("/:id", (req, res) => {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json(usuario);
});

// POST - crear un nuevo usuario
router.post("/", (req, res) => {
  const { nombre, apellido, email, contrasena } = req.body;
  if (!nombre || !email || !contrasena)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const usuarios = leerUsuarios();
  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    apellido,
    email,
    contrasena,
  };
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  res.status(201).json(nuevoUsuario);
});

// POST - login (datos sensibles van por body, no por URL)
router.post("/login", (req, res) => {
  const { email, contrasena } = req.body;
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(
    (u) => u.email === email && u.contrasena === contrasena
  );
  if (!usuario)
    return res.status(401).json({ error: "Credenciales incorrectas" });
  res.status(200).json({ mensaje: "Login exitoso", usuario });
});

// PUT - actualizar un usuario
router.put("/:id", (req, res) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Usuario no encontrado" });

  usuarios[index] = { ...usuarios[index], ...req.body };
  guardarUsuarios(usuarios);
  res.status(200).json(usuarios[index]);
});

// DELETE - eliminar usuario (con validación de integridad referencial)
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuarios = leerUsuarios();
  const ventas = leerVentas();

  const ventasDelUsuario = ventas.filter((v) => v.id_usuario === id);
  if (ventasDelUsuario.length > 0) {
    return res.status(400).json({
      error: "No se puede eliminar el usuario porque tiene ventas asociadas. Eliminá primero las ventas.",
    });
  }

  const nuevosUsuarios = usuarios.filter((u) => u.id !== id);
  if (nuevosUsuarios.length === usuarios.length)
    return res.status(404).json({ error: "Usuario no encontrado" });

  guardarUsuarios(nuevosUsuarios);
  res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
});

module.exports = router;