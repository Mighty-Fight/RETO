const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
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
  const createTableQuery = `
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

  db.query(createTableQuery, (createErr) => {
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
              Cantidad,
              DATE_FORMAT(Hora_entrada_lab, "%Y-%m-%d %H:%i:%s") AS Hora_entrada_lab,
              DATE_FORMAT(Hora_salida_lab, "%Y-%m-%d %H:%i:%s") AS Hora_salida_lab,
              INV,
              DATE_FORMAT(Hora_entrada_bodega, "%Y-%m-%d %H:%i:%s") AS Hora_entrada_bodega,
              DATE_FORMAT(Hora_salida_bodega, "%Y-%m-%d %H:%i:%s") AS Hora_salida_bodega 
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

app.get("/contabilidad-kits", (req, res) => {
  db.query("SELECT * FROM Contabilidad_Kits", (err, results) => {
    if (err) {
      console.error("Error al obtener los datos de Contabilidad_Kits:", err);
      res.status(500).send("Error en el servidor");
      return;
    }

    res.json(results);
  });
});

//Estaciones ^-^// Cambiar la ruta en el servidor para que espere el parámetro en la URL
app.get("/estaciones/:numeroEstacion", (req, res) => {
  const { numeroEstacion } = req.params;

  if (
    !numeroEstacion ||
    isNaN(numeroEstacion) ||
    numeroEstacion < 1 ||
    numeroEstacion > 7
  ) {
    res.status(400).send("Número de estación inválido");
    return;
  }

  const nombreTabla = `Estación_${numeroEstacion}`;

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

app.get("/said", (req, res) => {
  // Consulta para obtener las últimas 3 filas ordenadas por una columna específica
  db.query(
    `
  SELECT * FROM (
    SELECT *,
    ROW_NUMBER() OVER (ORDER BY ID DESC) AS rn
    FROM M1
  ) AS numberedRows
  WHERE rn <= 3
  ORDER BY rn DESC;  
  
  `,
    (err, results) => {
      if (err) {
        console.error("Error al obtener los datos de M1:", err);
        res.status(500).send("Error en el servidor");
        return;
      }
      res.json(results);
    }
  );
});

// ESTO ES ASIGNACIOOOOOOOOOOOOOOOOOOOOOOOOOOOOON
// Obtener tags de la estación 1
app.get("/tag", (req, res) => {
  db.query("SELECT Tag FROM Estación_1", (err, results) => {
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
    "SELECT Kit FROM Estación_1 WHERE Tag = ?",
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

  // Update Estación_1
  db.query(
    "UPDATE Estación_1 SET Kit = ? WHERE Tag = ?",
    [nombreKit, tag],
    (err, results) => {
      if (err) {
        console.error(
          "Error al actualizar el nombre del kit en Estación_1:",
          err
        );
        res.status(500).send("Error interno del servidor");
        return;
      }
      console.log(`Nombre de kit actualizado para el tag ${tag} en Estación_1`);
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

  db.query("SELECT Id FROM Estación_1 WHERE Tag = ?", [tag], (err, results) => {
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

  // Update Estación_1
  db.query(
    "UPDATE Estación_1 SET Id = ? WHERE Tag = ?",
    [idKit, tag],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el ID del kit en Estación_1:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      console.log(`ID de kit actualizado para el tag ${tag} en Estación_1`);
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
// crear tabla de contenido

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

app.post("/contenido/:kits", (req, res) => {
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

app.post("/eventosIngreso", (req, res) => {
  const { usuario, evento, descripcion, fecha, hora } = req.body;

  const insertEventoQuery =
    "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (?, ?, ?, ?, ?)";

  db.query(
    insertEventoQuery,
    [usuario, evento, descripcion, fecha, hora],
    (err, results) => {
      if (err) {
        console.error("Error al insertar el evento:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      console.log("Evento insertado correctamente");
      res.status(201).send("Evento insertado correctamente");
    }
  );
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

app.get("/Datos", (req, res) => {
  db.query("SELECT * FROM Datos", (err, results) => {
    if (err) {
      console.error("Error al obtener los datos de la tabla Solicitud:", err);
      res.status(500).send("Error en el servidor");
      return;
    }
    res.json(results);
  });
});

app.get("/Kits_armados", (req, res) => {
  db.query("SELECT * FROM Contenido", (err, results) => {
    if (err) {
      console.error("Error al obtener los datos de la tabla Solicitud:", err);
      res.status(500).send("Error en el servidor");
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

  // Define la consulta SQL para actualizar la columna Bahia en la tabla Datos
  const query = "UPDATE RETORFID.Datos SET Bahia = ? WHERE ID = ?";

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
  db.query("SELECT Pedido FROM Solicitud ORDER BY Pedido DESC LIMIT 1", (pedidoErr, pedidoResults) => {
    if (pedidoErr) {
      console.error(
        "Error al verificar el Pedido en la tabla Solicitud:",
        pedidoErr
      );
      res.status(500).send("Error interno del servidor");
      return;
    }

    const ultimoPedido = pedidoResults.length > 0 ? pedidoResults[0].Pedido : "";
    res.json({ pedidoRealizado: ultimoPedido });
  });
});



// Verificación salida pick
app.post("/actualizarINV", (req, res) => {
  const { EP } = req.body;

  // Obtener la hora actual en formato TIMESTAMP
  const currentDateTime = new Date().getTime();

  // Variable para almacenar el número de kit encontrado
  let kitNumber = null;

  // Variable para almacenar el pedido descuentado
  let descuentoPedido = null;

  let todosDescuentos = [];

  // Verificar si el EP está en la tabla Datos
  db.query("SELECT Nombre FROM Datos WHERE Tag = ?", [EP], (err, results) => {
    if (err) {
      console.error("Error al verificar el EP:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    if (results.length === 0) {
      console.log(
        `No se pudo encontrar el número del Kit en el nombre para EP: ${EP}`
      );
      res.status(500).send("Error interno del servidor");
      return;
    }

    const nombre = results[0].Nombre; //Kit 2

    // Extraer el número del Kit desde el nombre
    const regex = /Kit (\d+)/;
    const match = nombre.match(regex);
    if (match) {
      kitNumber = match[1]; // Aquí asignamos el número de kit encontrado
      console.log(`Número del Kit del EP: ${kitNumber}`);
    } else {
      console.log(
        `No se pudo encontrar el número del Kit en el nombre: ${nombre}`
      );
      res
        .status(500)
        .send(
          `Error: No se pudo encontrar el número del Kit en el nombre: ${nombre}`
        );
      return;
    }

    // Actualizar INV y Hora_salida_bodega en la tabla Datos
    db.query(
      "UPDATE Datos SET INV = 'NO', Hora_salida_bodega = ? WHERE Tag = ?",
      [currentDateTime, EP],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.error(
            "Error al actualizar INV y Hora_salida_bodega:",
            updateErr
          );
          res.status(500).send("Error interno del servidor");
          return;
        }
        console.log(
          `INV y Hora_salida_bodega actualizados para EP: ${EP}, ${currentDateTime}`
        );
      }
    );

    // Verificar el pedido actual en la tabla Solicitud
    db.query("SELECT Pedido FROM Solicitud", (pedidoErr, pedidoResults) => {
      if (pedidoErr) {
        console.error(
          "Error al verificar el Pedido en la tabla Solicitud:",
          pedidoErr
        );
        res.status(500).send("Error interno del servidor");
        return;
      }

      const ultimoPedido = pedidoResults.length > 0 ? pedidoResults[pedidoResults.length - 1].Pedido : "";
      
      console.log(`Último pedido en la tabla Solicitud: ${ultimoPedido}`);

      // Verificar si kitNumber está dentro de ultimoPedido
      if (ultimoPedido.includes(kitNumber)) {
        const pedidoArray = ultimoPedido.split(",");
        descuentoPedido = pedidoArray
          .filter((item) => item !== kitNumber)
          .join(",");
        console.log(`Haz pickeado correctamente el Kit: ${descuentoPedido}`);

        // Insertar el nuevo pedido en la tabla Solicitud
        db.query(
          "INSERT INTO Solicitud (Pedido) VALUES (?)",
          [descuentoPedido],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.error(
                "Error al insertar el nuevo pedido en la tabla Solicitud:",
                insertErr
              );
              res.status(500).send("Error interno del servidor");
              return;
            }
            console.log("Nuevo pedido insertado en la tabla Solicitud");

            // Agregar descuentoPedido a todosDescuentos
            todosDescuentos.push(descuentoPedido);

            // Si descuentoPedido es vacío, insertar evento en la tabla Eventos
            if (descuentoPedido === "") {
              const fecha = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD
              const hora = new Date().toLocaleTimeString(); // Hora actual en formato HH:MM:SS

              const descripcion = `Se solicitaron los siguientes kits: ${ultimoPedido}`;
              const evento = "Solicitud";

              // Insertar evento en la tabla Eventos
              // db.query(
              //   "INSERT INTO Eventos (usuario, evento, descripcion, fecha, hora) VALUES (?, ?, ?, ?, ?)",
              //   ["pistola", evento, descripcion, fecha, hora],
              //   (eventoErr, eventoResults) => {
              //     if (eventoErr) {
              //       console.error(
              //         "Error al insertar evento en la tabla Eventos:",
              //         eventoErr
              //       );
              //       res.status(500).send("Error interno del servidor");
              //       return;
              //     }
              //     console.log("Evento insertado en la tabla Eventos");
              //   }
              // );
            }
          }
        );
      } else {
        console.log(`No fue solicitado el Kit: ${kitNumber}`);
      }
    });
  });
});








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
