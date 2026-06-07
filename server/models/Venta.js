import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  fecha:      { type: Date, default: Date.now },
  total:      { type: Number, required: true },
  productos:  { type: Array, required: true },
});

export default mongoose.model("Venta", ventaSchema);