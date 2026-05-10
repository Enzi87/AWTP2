import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import usuariosRouter from "./routes/usuarios.js";
import productosRouter from "./routes/productos.js";
import ventasRouter from "./routes/ventas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../client/assets/images')));

app.use("/api/usuarios", usuariosRouter);
app.use("/api/productos", productosRouter);
app.use("/api/ventas", ventasRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});