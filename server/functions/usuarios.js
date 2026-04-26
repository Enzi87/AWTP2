import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// 🔥 reemplazo de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, "../data/usuarios.json");

const leerUsuarios = () =>
  JSON.parse(fs.readFileSync(filePath, "utf-8"));

const guardarUsuarios = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export { leerUsuarios, guardarUsuarios };