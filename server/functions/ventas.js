const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/ventas.json");

const leerVentas = () =>
  JSON.parse(fs.readFileSync(filePath, "utf-8"));

const guardarVentas = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

module.exports = { leerVentas, guardarVentas };