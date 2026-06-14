const express = require('express');
const app = express();

// Render nos da el puerto en process.env.PORT. Si no existe (en local), usa el 3000
const PORT = process.env.PORT || 3000;

// Una ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor de la Joyería Rocío está funcionando correctamente en producción.');
});

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo con éxito en el puerto ${PORT}`);
});