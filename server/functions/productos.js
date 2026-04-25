const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/productos.json");

const leerProductos = () =>
  JSON.parse(fs.readFileSync(filePath, "utf-8"));

const guardarProductos = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

module.exports = { leerProductos, guardarProductos };