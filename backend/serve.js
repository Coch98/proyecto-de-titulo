// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000; // Puedes elegir otro puerto si lo prefieres

// Middleware
app.use(cors()); // Permite solicitudes CORS
app.use(express.json()); // Para parsear el JSON

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
