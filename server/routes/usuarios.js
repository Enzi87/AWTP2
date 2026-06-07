import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import Usuario from "../models/Usuario.js";
import Venta from "../models/Venta.js";

const router = express.Router();

// GET - todos los usuarios
router.get("/", async (req, res) => {
  const usuarios = await Usuario.find();
  res.status(200).json(usuarios);
});

// GET - usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

// POST - registro
router.post("/", async (req, res) => {
  const { nombre, apellido, email, contrasena } = req.body;
  if (!nombre || !email || !contrasena)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const hash = await bcrypt.hash(contrasena, 10);
  const nuevoUsuario = new Usuario({ nombre, apellido, email, contrasena: hash });
  await nuevoUsuario.save();
  res.status(201).json(nuevoUsuario);
});

// POST - login
router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(401).json({ error: "Credenciales incorrectas" });

  const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordValida) return res.status(401).json({ error: "Credenciales incorrectas" });

  const token = jwt.sign(
    { id: usuario._id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({ mensaje: "Login exitoso", usuario, token });
});

// PUT - actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(actualizado);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

// DELETE - eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const ventasAsociadas = await Venta.find({ id_usuario: req.params.id });
    if (ventasAsociadas.length > 0)
      return res.status(400).json({ error: "No se puede eliminar: el usuario tiene ventas asociadas." });

    const eliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

export default router;