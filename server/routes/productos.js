import express from "express";
import Producto from "../models/Producto.js";

const router = express.Router();

// GET - todos los productos
router.get("/", async (req, res) => {
  const productos = await Producto.find();
  res.status(200).json(productos);
});

// GET - producto por ID
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(producto);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

// POST - crear producto
router.post("/", async (req, res) => {
  const { nombre, precio, categoria } = req.body;
  if (!nombre || !precio || !categoria)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const nuevo = new Producto({ ...req.body, activo: true });
  await nuevo.save();
  res.status(201).json(nuevo);
});

// POST - buscar por categoría
router.post("/buscar", async (req, res) => {
  const { categoria } = req.body;
  if (!categoria)
    return res.status(400).json({ error: "Debe ingresar una categoría" });

  const resultado = await Producto.find({
    categoria: { $regex: new RegExp(`^${categoria}$`, "i") }
  });

  if (resultado.length === 0)
    return res.status(404).json({ error: "No se encontraron productos para la categoría solicitada" });

  res.status(200).json(resultado);
});

// PUT - actualizar producto
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(actualizado);
  } catch {
    res.status(400).json({ error: "ID inválido" });
  }
});

export default router;