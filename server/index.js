const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Importar routers
const usuariosRouter = require("./routes/usuarios");
const productosRouter = require("./routes/productos");
const ventasRouter = require("./routes/ventas");

// Montar rutas
app.use("/api/usuarios", usuariosRouter);
app.use("/api/productos", productosRouter);
app.use("/api/ventas", ventasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});