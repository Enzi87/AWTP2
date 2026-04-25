const express = require("express");
const router = express.Router();
const { leerVentas, guardarVentas } = require("../functions/ventas");

// GET - todas las ventas
router.get("/", (req, res) => {
  res.status(200).json(leerVentas());
});

// GET - ventas de un usuario específico
router.get("/usuario/:id_usuario", (req, res) => {
  const ventas = leerVentas().filter(
    (v) => v.id_usuario === parseInt(req.params.id_usuario)
  );
  res.status(200).json(ventas);
});

// POST - registrar una venta nueva
router.post("/", (req, res) => {
  const { id_usuario, productos, total, direccion } = req.body;
  if (!id_usuario || !productos || !total)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const ventas = leerVentas();
  const nueva = {
    id: Date.now(),
    id_usuario,
    fecha: new Date().toISOString(),
    total,
    direccion,
    productos,
  };
  ventas.push(nueva);
  guardarVentas(ventas);
  res.status(201).json(nueva);
});

// POST - buscar ventas por rango de fechas (datos sensibles/complejos en body)
router.post("/buscar", (req, res) => {
  const { desde, hasta } = req.body;
  const resultado = leerVentas().filter((v) => {
    const fecha = new Date(v.fecha);
    return fecha >= new Date(desde) && fecha <= new Date(hasta);
  });
  res.status(200).json(resultado);
});

// PUT - actualizar dirección de entrega de una venta
router.put("/:id", (req, res) => {
  const ventas = leerVentas();
  const index = ventas.findIndex((v) => v.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Venta no encontrada" });

  ventas[index] = { ...ventas[index], ...req.body };
  guardarVentas(ventas);
  res.status(200).json(ventas[index]);
});

// DELETE - eliminar una venta
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const ventas = leerVentas();
  const nuevasVentas = ventas.filter((v) => v.id !== id);
  if (nuevasVentas.length === ventas.length)
    return res.status(404).json({ error: "Venta no encontrada" });

  guardarVentas(nuevasVentas);
  res.status(200).json({ mensaje: "Venta eliminada correctamente" });
});

module.exports = router;