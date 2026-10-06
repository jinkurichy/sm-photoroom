const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from app/src/main/assets
const staticPath = path.join(__dirname, 'app', 'src', 'main', 'assets');
app.use(express.static(staticPath));

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de SM PHOTOROOM corriendo en el puerto ${PORT}`);
});
