const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
  host: "db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "usuario123",
  database: "RETORFID",
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
    process.exit(1);
  }
  console.log("Conexión a la base de datos establecida");
  console.log(
    "El servidor de base de datos está corriendo en el puerto:",
    db.config.port
  );
});

app.get("/api/check-time-difference", (req, res) => {
  try {
    db.query(
      "SELECT Hora FROM picking ORDER BY Hora DESC LIMIT 1",
      (error, results) => {
        if (error) {
          console.error("Database query error:", error);
          return res.status(500).json({ error: "Database query error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "No records found" });
        }

        const lastTime = results[0].Hora;
        const currentTime = new Date();
        const timeDifference = (currentTime - new Date(lastTime)) / 1000; // Convert to seconds
        return res.json({ lastTime, currentTime, timeDifference });
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error" });
  }
});

app.post("/register", (req, res) => {
  const { nombre, codigoEstudiantil, nrc } = req.body;

  // Verificar si el nombre completo o el código estudiantil ya existen en la base de datos
  db.query(
    "SELECT * FROM Usuarios WHERE Nombre = ? OR Codigo_Estudiantil = ?",
    [nombre, codigoEstudiantil],
    (err, results) => {
      if (err) {
        console.error("Error al verificar el usuario:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      if (results.length > 0) {
        // Si el usuario ya está registrado, enviar un mensaje de error
        console.log("El usuario ya está registrado");
        res.status(400).send("El usuario ya está registrado");
      } else {
        // Si el usuario no está registrado, proceder con el registro
        db.query(
          "INSERT INTO Usuarios (Nombre, Codigo_Estudiantil, NRC) VALUES (?, ?, ?)",
          [nombre, codigoEstudiantil, nrc],
          (err, results) => {
            if (err) {
              console.error("Error al registrar el usuario:", err);
              res.status(500).send("Error interno del servidor");
              return;
            }

            console.log("Usuario registrado correctamente");
            res.status(201).send("Usuario registrado correctamente");
          }
        );
      }
    }
  );
});

// Endpoint para verificar la existencia de un usuario
app.post("/verificarUsuario", (req, res) => {
  const { codigoEstudiantil } = req.body;

  db.query(
    "SELECT * FROM Usuarios WHERE Codigo_Estudiantil = ?",
    [codigoEstudiantil],
    (err, results) => {
      if (err) {
        console.error("Error al verificar el usuario:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      if (results.length > 0) {
        res.status(200).json({ mensaje: "Usuario encontrado" });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    }
  );
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM Usuarios", (err, results) => {
    if (err) {
      console.error(
        "Error al seleccionar registros de la tabla Usuarios:",
        err
      );
      res.status(500).send("Error interno del servidor");
      return;
    }

    let table =
      "<h1>Registros de la tabla Usuarios</h1><table><tr><th>ID</th><th>Nombre completo</th><th>Código estudiantil</th></tr>";
    results.forEach((row) => {
      table += `<tr><td>${row.id}</td><td>${row.Nombre}</td><td>${row.Codigo_Estudiantil}</td></tr>`;
    });
    table += "</table>";

    res.send(table);
  });
});

app.post("/contenido", (req, res) => {
  const { nuevoPedido } = req.body;

  // Crear la tabla Solicitud si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Solicitud (
      Pedido VARCHAR(1000)
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error al crear la tabla Solicitud:", err);
      res.status(500).send("Error al crear la tabla");
      return;
    }

    const insertQuery = "INSERT INTO Solicitud (Pedido) VALUES (?)";

    // Primera inserción del pedido proporcionado
    db.query(insertQuery, [nuevoPedido], (err, results) => {
      if (err) {
        console.error("Error al insertar el registro:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
    });
    // Enviar respuesta después de la primera inserción (considerando que el segundo insert no afecta al cliente)
    res.status(201).send("Registro insertado correctamente");
  });
});

app.post("/posicion", (req, res) => {
  const {
    Col1: col1,
    Col2: col2,
    Col3: col3,
    Col4: col4,
    Col5: col5,
    Col6: col6,
    Col7: col7,
    Col8: col8,
    Col9: col9,
    Col10: col10,
  } = req.body;

  // Crear la tabla si no existe
  const createTableM1Query = `
    CREATE TABLE IF NOT EXISTS M1 (
      \`ID\` INT AUTO_INCREMENT PRIMARY KEY,
      \`Col1\` VARCHAR(255),
      \`Col2\` VARCHAR(255),
      \`Col3\` VARCHAR(255),
      \`Col4\` VARCHAR(255),
      \`Col5\` VARCHAR(255),
      \`Col6\` VARCHAR(255),
      \`Col7\` VARCHAR(255),
      \`Col8\` VARCHAR(255),
      \`Col9\` VARCHAR(255),
      \`Col10\` VARCHAR(255)
    );
  `;

  db.query(createTableM1Query, (createErr) => {
    if (createErr) {
      console.error("Error al crear/verificar la tabla M1:", createErr);
      res.status(500).send("Error al crear la tabla M1");
      return;
    }

    // Insertar datos en la tabla una vez creada
    const insertQuery =
      "INSERT INTO M1 (`Col1`, `Col2`, `Col3`, `Col4`, `Col5`, `Col6`, `Col7`, `Col8`, `Col9`, `Col10`) VALUES (?,?,?,?,?,?,?,?,?,?)";
    db.query(
      insertQuery,
      [col1, col2, col3, col4, col5, col6, col7, col8, col9, col10],
      (err, results) => {
        if (err) {
          console.error("Error al insertar el registro:", err);
          res.status(500).send("Error interno del servidor");
          return;
        }
        console.log("Registro insertado correctamente");
        res.status(201).send("Registro insertado correctamente");
      }
    );
  });
});

app.get("/inventario_rack", (req, res) => {
  const query = `
      SELECT Nombre, COUNT(*) as Cantidad
      FROM Datos
      WHERE Nombre LIKE 'Kit %' AND INV = 'SI'
      GROUP BY Nombre
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al seleccionar registros:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(results);
    }
  });
});

// inventario llamado de tabla a sql
app.get("/michi", (req, res) => {
  db.query(
    `SELECT 
              ID,
              Tag,
              Nombre,
              Bahia,
              Cantidad,
              DATE_FORMAT(Hora_entrada_lab, "%Y-%m-%d %H:%i:%s") AS Hora_entrada_lab,
              DATE_FORMAT(Hora_salida_lab, "%Y-%m-%d %H:%i:%s") AS Hora_salida_lab,
              INV,
              Hora_entrada_bodega,
              Hora_salida_bodega 
            FROM RETORFID.Datos`,
    (err, results) => {
      if (err) {
        console.error("Error al obtener los datos:", err);
        res.status(500).send("Error en el servidor");
        return;
      }
      res.json(results);
    }
  );
});


//Estaciones ^-^// Cambiar la ruta en el servidor para que espere el parámetro en la URL
app.get("/Estaciones/:numeroEstacion", (req, res) => {
  const { numeroEstacion } = req.params;

  if (
    !numeroEstacion ||
    isNaN(numeroEstacion) ||
    numeroEstacion < 1 ||
    numeroEstacion > 7
  ) {
    res.status(400).send("Número de Estacion inválido");
    return;
  }

  const nombreTabla = `Estacion_${numeroEstacion}`;

  db.query(`SELECT * FROM ${nombreTabla}`, (err, results) => {
    if (err) {
      console.error(`Error al leer los datos de ${nombreTabla}:`, err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.json(results);
  });
});

// Endpoint para enviar datos a la base de datos al detener el contador
app.post("/sets", (req, res) => {
  const { usuario, evento, descripcion, fecha, hora } = req.body;

  const query =
    "INSERT INTO RETORFID.Eventos (usuario, evento, descripcion, fecha, hora) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [usuario, evento, descripcion, fecha, hora],
    (err, result) => {
      if (err) {
        console.error("Error al insertar los datos en la base de datos:", err);
        res.status(500).send("Error en el servidor");
        return;
      }
      res.send("Datos insertados correctamente en la tabla Eventos");
    }
  );
});
/////////////////////////////////////////////////////////
// Obtener tags de la estación 1
app.get("/tag", (req, res) => {
  db.query("SELECT Tag FROM Estacion_1", (err, results) => {
    if (err) {
      console.error("Error al obtener los tags:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    if (results.length > 0) {
      const tags = results.map((result) => result.Tag); // Extraemos solo los tags de los resultados
      res.json(tags);
    } else {
      res.status(404).send("No se encontraron tags");
    }
  });
});

// Obtener el nombre del kit de un tag específico
app.get("/nombrekit/:tag", (req, res) => {
  const { tag } = req.params;

  db.query(
    "SELECT Kit FROM Datos WHERE Tag = ?",
    [tag],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el nombre del kit:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      if (results.length > 0) {
        res.json(results[0].Kit); // Devolvemos el nombre del kit si existe
      } else {
        res.json(""); // Devolvemos un nombre vacío si no existe
      }
    }
  );
});

// Actualizar el nombre del kit de un tag específico
app.post("/nombrekit/:tag", (req, res) => {
  const { tag } = req.params;
  const { nombreKit } = req.body;

  // Update Estacion_1
  db.query(
    "UPDATE Estacion_1 SET Kit = ? WHERE Tag = ?",
    [nombreKit, tag],
    (err, results) => {
      if (err) {
        console.error(
          "Error al actualizar el nombre del kit en Estacion_1:",
          err
        );
        res.status(500).send("Error interno del servidor");
        return;
      }
      console.log(`Nombre de kit actualizado para el tag ${tag} en Estacion_1`);
      // Update Datos
      db.query(
        "UPDATE Datos SET Nombre = ? WHERE Tag = ?",
        [nombreKit, tag],
        (err, results) => {
          if (err) {
            console.error(
              "Error al actualizar el nombre del kit en Datos:",
              err
            );
            res.status(500).send("Error interno del servidor");
            return;
          }
          console.log(`Nombre de kit actualizado para el tag ${tag} en Datos`);
          res.send("Nombre de kit actualizado correctamente");
        }
      );
    }
  );
});

// Obtener el ID del kit de un tag específico
app.get("/idkit/:tag", (req, res) => {
  const { tag } = req.params;

  db.query("SELECT Id FROM Datos WHERE Tag = ?", [tag], (err, results) => {
    if (err) {
      console.error("Error al obtener el ID del kit:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    if (results.length > 0) {
      res.json(results[0].Id); // Devolvemos el ID del kit si existe
    } else {
      res.json(""); // Devolvemos un ID vacío si no existe
    }
  });
});

// Actualizar el ID del kit de un tag específico
app.post("/idkit/:tag", (req, res) => {
  const { tag } = req.params;
  const { idKit } = req.body;

  // Update Estacion_1
  db.query(
    "UPDATE Estacion_1 SET Id = ? WHERE Tag = ?",
    [idKit, tag],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el ID del kit en Estacion_1:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      console.log(`ID de kit actualizado para el tag ${tag} en Estacion_1`);
      // Update Datos
      db.query(
        "UPDATE Datos SET Id = ? WHERE Tag = ?",
        [idKit, tag],
        (err, results) => {
          if (err) {
            console.error("Error al actualizar el ID del kit en Datos:", err);
            res.status(500).send("Error interno del servidor");
            return;
          }
          console.log(`ID de kit actualizado para el tag ${tag} en Datos`);
          res.send("ID de kit actualizado correctamente");
        }
      );
    }
  );
});

// ESTO ES ASIGNACIOOOOOOOOOOOOOOOOOOOOOOOOOOOOON

///////////////////////////////////////////////////////

// Crear la tabla 'Contenido' si no existe
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Contenido (
      Kits VARCHAR(45),
      Contenido VARCHAR(255)
    );
  `;

db.query(createTableQuery, (err, result) => {
  if (err) {
    console.error("Error al crear la tabla Contenido:", err);
    return;
  }
  console.log("Tabla Contenido creada o ya existe");
});

// Aqui se solicita la tabla Contenido para la pagina contenido

app.post("/contenido1/:kits", (req, res) => {
  const { kits } = req.params;
  const { Contenido } = req.body;

  const query = "UPDATE RETORFID.Contenido SET Contenido = ? WHERE Kits = ?";
  db.query(query, [Contenido, kits], (err, result) => {
    if (err) {
      console.error("Error al actualizar los datos:", err);
      res.status(500).send("Error en el servidor");
      return;
    }
    res.send({ Kits: kits, Contenido });
  });
});

app.get("/contenido_kits", (req, res) => {
  const contenidoQuery = `
    SELECT Kits, Contenido
    FROM Contenido
  `;

  db.query(contenidoQuery, (err, contenidoResults) => {
    if (err) {
      console.error("Error al obtener el contenido de los kits:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    const contenido = contenidoResults.reduce((acc, row) => {
      acc[row.Kits] = row.Contenido;
      return acc;
    }, {});

    res.json({
      contenido: contenido,
    });
  });
});



app.post("/contenido1", (req, res) => {
  const { Kits, Contenido } = req.body;

  const query =
    "INSERT INTO RETORFID.Contenido (Kits, Contenido) VALUES (?, ?)";
  db.query(query, [Kits, Contenido], (err, result) => {
    if (err) {
      console.error("Error al insertar los datos:", err);
      res.status(500).send("Error en el servidor");
      return;
    }
    res.send({ Kits, Contenido });
  });
});

app.get("/contenido", (req, res) => {
  db.query("SELECT Kits, Contenido FROM RETORFID.Contenido", (err, results) => {
    if (err) {
      console.error("Error al obtener los datos:", err);
      res.status(500).send("Error en el servidor");
      return;
    }
    res.json(results);
  });
});

app.get("/kits_info", (req, res) => {
  const contenidoQuery = "SELECT COUNT(*) AS count FROM Contenido";
  const disponibilidadQuery = `
    SELECT Nombre, COUNT(*) as Disponibles
    FROM Datos
    WHERE INV = 'SI'
    GROUP BY Nombre
  `;

  db.query(contenidoQuery, (err, contenidoResults) => {
    if (err) {
      console.error("Error al obtener los datos de Contenido:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    db.query(disponibilidadQuery, (err, disponibilidadResults) => {
      if (err) {
        console.error("Error al obtener la disponibilidad de kits:", err);
        res.status(500).send("Error en el servidor");
        return;
      }

      const disponibles = disponibilidadResults.reduce((acc, row) => {
        acc[row.Nombre] = row.Disponibles;
        return acc;
      }, {});

      console.log("Número de kits en Contenido:", contenidoResults[0].count);
      console.log("Disponibles:", disponibles);

      res.json({
        contenidoCount: contenidoResults[0].count,
        disponibles: disponibles,
      });
    });
  });
});

app.get("/solicitud", (req, res) => {
  db.query("SELECT * FROM Solicitud", (err, results) => {
    if (err) {
      console.error("Error al obtener los datos de la tabla Solicitud:", err);
      res.status(500).send("Error en el servidor");
      return;
    }
    res.json(results);
  });
});



app.get("/eventos", (req, res) => {
  const {
    fechaInteres,
    horaInicial,
    horaFinal,
    solicitudes,
    ingresoMaterial,
    kitsArmados,
    asignacionKits,
    asignacionContenido,
    setsTerminados,
    salida,
    entrada,
  } = req.query;

  let query = "SELECT * FROM Eventos WHERE 1=1"; // Base de la consulta
  let queryParams = [];

  // Añadir condiciones para los eventos
  let eventConditions = [];
  if (solicitudes) eventConditions.push("evento = 'solicitud'");
  if (ingresoMaterial) eventConditions.push("evento = 'Ingreso Material'");
  if (kitsArmados) eventConditions.push("evento = 'Kit Armado'");
  if (asignacionKits) eventConditions.push("evento = 'Asignación Kits'");
  if (asignacionContenido)
    eventConditions.push("evento = 'Asignación Contenido'");
  if (setsTerminados) eventConditions.push("evento = 'Set Terminado'");
  if (salida) eventConditions.push("evento = 'SALIDA'");
  if (entrada) eventConditions.push("evento = 'ENTRADA'");

  if (eventConditions.length > 0) {
    query += " AND (" + eventConditions.join(" OR ") + ")";
  }

  if (fechaInteres) {
    query += " AND fecha = ?";
    queryParams.push(fechaInteres);
  }
  if (horaInicial) {
    query += " AND hora >= ?";
    queryParams.push(horaInicial);
  }
  if (horaFinal) {
    query += " AND hora <= ?";
    queryParams.push(horaFinal);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error al obtener los datos de eventos:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.json(results);
  });
});


app.post("/solicitar", (req, res) => {
  const { nuevoPedido, nombreUsuario } = req.body;

  const createSolicitudTableQuery = `
    CREATE TABLE IF NOT EXISTS Solicitud (
      id INT AUTO_INCREMENT PRIMARY KEY,
      Pedido TEXT NOT NULL
    )
  `;

  const createEventosTableQuery = `
    CREATE TABLE IF NOT EXISTS Eventos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(255) NOT NULL,
      evento VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      fecha DATE NOT NULL,
      hora TIME NOT NULL
    )
  `;

  const insertSolicitudQuery = "INSERT INTO Solicitud (Pedido) VALUES (?)";
  const insertEventosQuery =
    "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (?, ?, ?, ?, ?)";

  const now = new Date();
  const fecha = now.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const hora = now.toTimeString().split(" ")[0]; // Formato HH:MM:SS

  db.query(createSolicitudTableQuery, (err, results) => {
    if (err) {
      console.error("Error al crear la tabla Solicitud:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    db.query(createEventosTableQuery, (err, results) => {
      if (err) {
        console.error("Error al crear la tabla Eventos:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      db.query(insertSolicitudQuery, [nuevoPedido], (err, results) => {
        if (err) {
          console.error("Error al insertar el pedido:", err);
          res.status(500).send("Error interno del servidor");
          return;
        }

        const evento = "solicitud";
        const descripcion = `Se solicitaron los siguientes kits: ${nuevoPedido}`;

        db.query(
          insertEventosQuery,
          [nombreUsuario, evento, descripcion, fecha, hora],
          (err, results) => {
            if (err) {
              console.error("Error al insertar el evento:", err);
              res.status(500).send("Error interno del servidor");
              return;
            }

            res.status(201).json({
              message: "Pedido registrado correctamente y evento guardado",
            });
          }
        );
      });
    });
  });
});
// Desde aqui se implementa ingreso de material
app.post("/guardarCambios", (req, res) => {
  const updates = req.body; // Los datos enviados desde el frontend

  // Define la consulta SQL para actualizar la col Bahia en la tabla Datos
  const query = "UPDATE Datos SET Bahia = ? WHERE ID = ?";
  // Ejecuta la consulta SQL para cada actualización
  updates.forEach((update) => {
    const { id, bahia } = update;
    db.query(query, [bahia, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar los datos:", err);
        return res.status(500).send("Error en el servidor");
      }
    });
  });

  // Envía una respuesta de éxito una vez que todas las consultas se han ejecutado
  res.send({ status: "success", message: "Datos actualizados correctamente" });
});

// Obtener el último pedido realizado
app.get("/ultimoPedido", (req, res) => {
  // Consultar el último pedido en la tabla Solicitud
  db.query(
    "SELECT Pedido FROM Solicitud ORDER BY ID DESC LIMIT 1",
    (pedidoErr, pedidoResults) => {
      if (pedidoErr) {
        console.error(
          "Error al verificar el Pedido en la tabla Solicitud:",
          pedidoErr
        );
        res.status(500).send("Error interno del servidor");
        return;
      }

      const ultimoPedido =
        pedidoResults.length > 0 ? pedidoResults[0].Pedido : "";
      res.json({ pedidoRealizado: ultimoPedido });
    }
  );
});


app.post("/actualizarInventario", (req, res) => {
  const { EP } = req.body;

  // Verificar si el EP existe en la tabla Datos
  db.query("SELECT * FROM Datos WHERE Tag = ?", [EP], (err, results) => {
    if (err) {
      console.error("Error al verificar el EP:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length > 0) {
      // Si se encuentra el EP, actualizar INV a 'ENCONTRADOPERRA'
      db.query(
        "UPDATE Datos SET INV = 'ENCONTRADOPERRA' WHERE Tag = ?",
        [EP],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Error al actualizar INV:", updateErr);
            return res.status(500).json({ error: "Error interno del servidor" });
          }

          console.log(`EP encontrado y actualizado: ${EP}`);
          return res.json({ success: true, message: `EP encontrado y actualizado: ${EP}` });
        }
      );
    } else {
      // Si no se encuentra el EP, registrar un mensaje en la consola
      console.log(`No se encontró un Tag igual a EP: ${EP}`);
      return res.json({ success: false, message: `No se encontró un Tag igual a EP: ${EP}` });
    }
  });
});


// Endpoint para crear la tabla 'Modo'
app.post("/tablemode", (req, res) => {
  const createTableModoQuery = `
    CREATE TABLE IF NOT EXISTS Modo (
      id INT AUTO_INCREMENT,
      Estacion_1 VARCHAR(100) NOT NULL,
      Estacion_2 VARCHAR(100) NOT NULL,
      Estacion_3 VARCHAR(100) NOT NULL,
      Estacion_4 VARCHAR(100) NOT NULL,
      Estacion_5 VARCHAR(100) NOT NULL,
      Estacion_6 VARCHAR(100) NOT NULL,
      Estacion_7 VARCHAR(100) NOT NULL,
      PRIMARY KEY (id)
    )
  `;

  db.query(createTableModoQuery, (err, result) => {
    if (err) {
      console.error("Error al crear la tabla Modo:", err);
      return res.status(500).json({ error: "Error al crear la tabla Modo" });
    }
    res.status(200).json({ message: "Tabla Modo creada o ya existe" });
  });
});

// Endpoint para manejar la solicitud POST de datos y actualizar la primera fila de la tabla
app.post("/modos", (req, res) => {
  const { stationNumber, columnValue } = req.body;

  // Verificar que stationNumber esté dentro de los valores permitidos (1 a 7)
  if (stationNumber < 1 || stationNumber > 7) {
    return res
      .status(400)
      .json({ error: "Número de Estacion fuera de rango válido (1-7)" });
  }

  // Nombre de la col basado en stationNumber
  const columnName = `Estacion_${stationNumber}`;

  // Obtener el id de la primera fila
  const getFirstRowIdQuery = `SELECT id FROM Modo ORDER BY id ASC LIMIT 1`;

  db.query(getFirstRowIdQuery, (err, rows) => {
    if (err) {
      console.error("Error al obtener el id de la primera fila:", err);
      return res.status(500).json({ error: "Error al actualizar datos" });
    }

    // Asegurarse de que se haya encontrado un id
    if (rows.length > 0) {
      const firstRowId = rows[0].id;

      // Actualizar la primera fila basada en el id obtenido
      const updateQuery = `
        UPDATE Modo
        SET ${columnName} = ?
        WHERE id = ?
      `;

      db.query(updateQuery, [columnValue, firstRowId], (err, result) => {
        if (err) {
          console.error("Error al actualizar datos:", err);
          return res.status(500).json({ error: "Error al actualizar datos" });
        }
        res.status(200).json({
          message: "Datos actualizados correctamente en la base de datos",
        });
      });
    } else {
      console.error(
        "No se encontró ninguna fila en la tabla Modo para actualizar"
      );
      res
        .status(404)
        .json({ error: "No se encontró ninguna fila para actualizar" });
    }
  });
});

// Endpoint para crear la tabla M1 si no existe
app.post("/createTableM1", (req, res) => {
  const createTableM1Query = `
  CREATE TABLE IF NOT EXISTS M1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Col1 VARCHAR(100) NOT NULL,
    Col2 VARCHAR(100) NOT NULL,
    Col3 VARCHAR(100) NOT NULL,
    Col4 VARCHAR(100) NOT NULL,
    Col5 VARCHAR(100) NOT NULL,
    Col6 VARCHAR(100) NOT NULL,
    Col7 VARCHAR(100) NOT NULL,
    Col8 VARCHAR(100) NOT NULL,
    Col9 VARCHAR(100) NOT NULL,
    Col10 VARCHAR(100) NOT NULL
  )
`;

  // Ejecutar la consulta para crear la tabla M1
  db.query(createTableM1Query, (err, result) => {
    if (err) {
      console.error("Error al crear la tabla M1:", err);
      return res.status(500).json({ error: "Error al crear la tabla M1" });
    }
    console.log("Tabla M1 creada o ya existente");
    res.status(200).json({ message: "Tabla M1 creada o ya existe" });
  });
});

// Endpoint para obtener los datos de las columnas Nombre y Bahia de la tabla DATOS
app.get("/getm1", (req, res) => {
  const getDatosQuery = "SELECT Nombre, Bahia FROM Datos";

  db.query(getDatosQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener los datos de la tabla Datos:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener los datos de la tabla DATOS" });
    }
    res.status(200).json(results);
  });
});

// Endpoint para guardar la matriz ordenada en la base de datos
app.post("/saveM1", async (req, res) => {
  const matrizOrdenada = req.body.matriz;

  // Validar la matriz recibida
  if (
    !matrizOrdenada ||
    !Array.isArray(matrizOrdenada) ||
    matrizOrdenada.length !== 3 ||
    !Array.isArray(matrizOrdenada[0]) ||
    matrizOrdenada[0].length !== 10 ||
    !Array.isArray(matrizOrdenada[1]) ||
    matrizOrdenada[1].length !== 10 ||
    !Array.isArray(matrizOrdenada[2]) ||
    matrizOrdenada[2].length !== 10
  ) {
    return res.status(400).json({ error: "Matriz ordenada inválida" });
  }

  // Definir la consulta de actualización
  const updateQuery = `
    UPDATE M1
    SET 
      Col1 = ?,
      Col2 = ?,
      Col3 = ?,
      Col4 = ?,
      Col5 = ?,
      Col6 = ?,
      Col7 = ?,
      Col8 = ?,
      Col9 = ?,
      Col10 = ?
    WHERE id = ?;`;

  // Preparar los valores para la consulta de actualización de la primera fila
  const values1 = [
    matrizOrdenada[0][0] || null,
    matrizOrdenada[0][1] || null,
    matrizOrdenada[0][2] || null,
    matrizOrdenada[0][3] || null,
    matrizOrdenada[0][4] || null,
    matrizOrdenada[0][5] || null,
    matrizOrdenada[0][6] || null,
    matrizOrdenada[0][7] || null,
    matrizOrdenada[0][8] || null,
    matrizOrdenada[0][9] || null,
    1, // Reemplaza con el valor de 'id' correspondiente a la primera fila que deseas actualizar
  ];

  // Preparar los valores para la consulta de actualización de la segunda fila
  const values2 = [
    matrizOrdenada[1][0] || null,
    matrizOrdenada[1][1] || null,
    matrizOrdenada[1][2] || null,
    matrizOrdenada[1][3] || null,
    matrizOrdenada[1][4] || null,
    matrizOrdenada[1][5] || null,
    matrizOrdenada[1][6] || null,
    matrizOrdenada[1][7] || null,
    matrizOrdenada[1][8] || null,
    matrizOrdenada[1][9] || null,
    2, // Reemplaza con el valor de 'id' correspondiente a la segunda fila que deseas actualizar
  ];

  // Preparar los valores para la consulta de actualización de la tercera fila
  const values3 = [
    matrizOrdenada[2][0] || null,
    matrizOrdenada[2][1] || null,
    matrizOrdenada[2][2] || null,
    matrizOrdenada[2][3] || null,
    matrizOrdenada[2][4] || null,
    matrizOrdenada[2][5] || null,
    matrizOrdenada[2][6] || null,
    matrizOrdenada[2][7] || null,
    matrizOrdenada[2][8] || null,
    matrizOrdenada[2][9] || null,
    3, // Reemplaza con el valor de 'id' correspondiente a la tercera fila que deseas actualizar
  ];

  // Ejecutar las tres consultas de actualización en la base de datos en paralelo
  try {
    await Promise.all([
      new Promise((resolve, reject) => {
        db.query(updateQuery, values1, (err, result) => {
          if (err) {
            console.error(
              "Error al actualizar datos en la tabla M1 (fila 1):",
              err
            );
            return reject(err);
          }
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(updateQuery, values2, (err, result) => {
          if (err) {
            console.error(
              "Error al actualizar datos en la tabla M1 (fila 2):",
              err
            );
            return reject(err);
          }
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(updateQuery, values3, (err, result) => {
          if (err) {
            console.error(
              "Error al actualizar datos en la tabla M1 (fila 3):",
              err
            );
            return reject(err);
          }
          resolve(result);
        });
      }),
    ]);

    res.status(200).json({ message: "Matriz actualizada exitosamente" });
  } catch (error) {
    console.error("Error al guardar la matriz en la base de datos:", error);
    res
      .status(500)
      .json({ error: "Error al guardar la matriz en la base de datos" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
