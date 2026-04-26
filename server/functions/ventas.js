import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, "../data/ventas.json");

const leerVentas = () =>
  JSON.parse(fs.readFileSync(filePath, "utf-8"));

const guardarVentas = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export { leerVentas, guardarVentas };