const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/usuarios.json");

const leerUsuarios = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));

const guardarUsuarios = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

module.exports = { leerUsuarios, guardarUsuarios };