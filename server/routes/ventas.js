import express from "express";
import Venta from "../models/Venta.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// GET - todas las ventas
router.get("/", async (req, res) => {
  const ventas = await Venta.find();
  res.status(200).json(ventas);
});

// GET - ventas de un usuario específico
router.get("/usuario/:id_usuario", async (req, res) => {
  const ventas = await Venta.find({ id_usuario: req.params.id_usuario });
  res.status(200).json(ventas);
});

// POST - registrar venta (protegida con JWT)
router.post("/", verificarToken, async (req, res) => {
  const { id_usuario, productos, total, direccion } = req.body;
  if (!id_usuario || !productos || !total)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const nueva = new Venta({
    id_usuario,
    fecha: new Date(),
    total,
    direccion,
    productos,
  });
  await nueva.save();
  res.status(201).json(nueva);
});

// POST - buscar por rango de fechas
router.post("/buscar", async (req, res) => {
  const { desde, hasta } = req.body;
  const resultado = await Venta.find({
    fecha: {
      $gte: new Date(desde),
      $lte: new Date(hasta),
    },
  });
  res.status(200).json(resultado);
});

// PUT - actualizar venta
router.put("/:id", async (req, res) => {
  try {
    const actualizada = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizada) return res.status(404).json({ error: "Venta no encontrada" });
    res.status(200).json(actualizada);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

// DELETE - eliminar venta
router.delete("/:id", async (req, res) => {
  try {
    const eliminada = await Venta.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: "Venta no encontrada" });
    res.status(200).json({ mensaje: "Venta eliminada correctamente" });
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

export default router;