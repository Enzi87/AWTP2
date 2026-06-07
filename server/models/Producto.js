import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre:      { type: String, required: true },
  descripcion: { type: String },
  precio:      { type: Number, required: true },
  imagen:      { type: String },
  categoria:   { type: String },
  stock:       { type: Number, default: 0 },
  activo:      { type: Boolean, default: true },
  destacado:   { type: Boolean, default: false },
});

export default mongoose.model("Producto", productoSchema);