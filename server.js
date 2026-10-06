const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Buscar automáticamente la carpeta donde se encuentra index.html
let staticPath = __dirname;

if (fs.existsSync(path.join(__dirname, 'app', 'src', 'main', 'assets', 'index.html'))) {
    staticPath = path.join(__dirname, 'app', 'src', 'main', 'assets');
} else if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
    staticPath = path.join(__dirname, 'public');
}

// Servir archivos estáticos
app.use(express.static(staticPath));

// Ruta explícita para el inicio '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Ruta de respaldo (fallback)
app.get('*', (req, res) => {
    const indexPath = path.join(staticPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send('<h1>🚀 Servidor SM PHOTOROOM en ejecución</h1>');
    }
});

// Escuchar en 0.0.0.0 (Requisito indispensable para el proxy de Railway)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de SM PHOTOROOM corriendo en el puerto ${PORT}`);
    console.log(`📁 Archivos cargados desde: ${staticPath}`);
});
