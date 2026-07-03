import express from 'express';
import cors from 'cors';
import {createClient} from '@supabase/supabase-js';
import 'dotenv/config';
//Importacion de las rutas
import productosRouter from "./routes/productos.js";
import contactoRouter from "./routes/contacto.js";

const app = express();
app.use(cors());
app.use(express.json());

//Enlaces de las APIs a sus rutas
app.use('/api/productos', productosRouter);
app.use('/api/contacto', contactoRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor API corriendo en el puerto ${PORT}`);
});