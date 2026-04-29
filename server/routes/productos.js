import express from "express";
import { leerProductos, guardarProductos } from "../functions/productos.js";

const router = express.Router();

// GET - todos los productos
router.get("/", (req, res) => {
  res.status(200).json(leerProductos());
});

// GET - producto por ID
router.get("/:id", (req, res) => {
  const producto = leerProductos().find((p) => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.status(200).json(producto);
});

// POST - crear producto
router.post("/", (req, res) => {
  const { nombre, precio, categoria } = req.body;
  if (!nombre || !precio || !categoria)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const productos = leerProductos();
  const nuevo = { id: Date.now(), ...req.body, activo: true };
  productos.push(nuevo);
  guardarProductos(productos);
  res.status(201).json(nuevo);
});

// POST - buscar productos por categoría
router.post("/buscar", (req, res) => {
  const { categoria } = req.body;

  // Validar dato obligatorio
  if (!categoria) {
    return res.status(400).json({
      error: "Debe ingresar una categoría"
    });
  }

  const resultado = leerProductos().filter(
    (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
  );

  // Si no hay resultados
  if (resultado.length === 0) {
    return res.status(404).json({
      error: "No se encontraron productos para la categoría solicitada"
    });
  }

  res.status(200).json(resultado);
});

// PUT - actualizar producto
router.put("/:id", (req, res) => {
  const productos = leerProductos();
  const index = productos.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

  productos[index] = { ...productos[index], ...req.body };
  guardarProductos(productos);
  res.status(200).json(productos[index]);
});

export default router;