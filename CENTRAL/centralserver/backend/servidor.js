const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'usuario123',
  database: 'estaciones'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a la base de datos establecida');
  console.log('El servidor de base de datos está corriendo en el puerto:', db.config.port);
});


const PORT = 3000; // Cambio del puerto a 5000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
