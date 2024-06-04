import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Instructivo from "../Media/Instructivo.pdf";
import IconPause from "../Media/pause-solid.svg";
import IconPlay from "../Media/play-solid.svg";
import IconStop from "../Media/stop-solid.svg";
import Header from "../components/header";
import Popup from "../components/popup";
import "./Estado.css";

function Estado() {
  const [data, setData] = useState([]);
  const [showButtons, setShowButtons] = useState(false); // Estado para controlar la visibilidad de los botones
  const [selectedStation, setSelectedStation] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [tiempoSet, setTiempoSet] = useState("00:00");
  const [intervalId, setIntervalId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Guarda el tiempo transcurrido en milisegundos
  const [showPopup, setShowPopup] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Simulación de datos de estaciones
  const stations = [
    "Estación 1",
    "Estación 2",
    "Estación 3",
    "Estación 4",
    "Estación 5",
    "Estación 6",
    "Estación 7",
  ];

  useEffect(() => {
    const fetchData = async () => {
      
      if (selectedStation) {
        // Sustituir espacio por '_' para coincidir con el nombre de la tabla
        const stationNumber = selectedStation.split(" ")[1];

        // Realizar la consulta a la tabla correspondiente para la estación seleccionada
        try {
          const response = await fetch(
            `http://192.168.0.100:5000/estaciones/${stationNumber}`
          );
          if (!response.ok) {
            throw new Error(
              `Network response for Estacion_${stationNumber} was not ok`
            );
          }
          const stationData = await response.json();
          // Formatear la fecha de ingreso antes de calcular el tiempo transcurrido
          const formattedStationData = stationData.map((item) => ({
            ...item,
            fechaIngreso: formatDateTime(item.Hora_entrada),
            TiempoTranscurrido: calculateElapsedTime(item.Hora_entrada),
          }));

          // Agregar registros de consola para verificar el formato de las fechas después del formateo
          console.log("Datos con formato de fecha:", formattedStationData);

          setData(formattedStationData);
        } catch (error) {
          console.error(
            `Error fetching data for Estacion_${stationNumber}:`,
            error
          );
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    function formatDateTime(dateTimeString) {
      const dateObj = new Date(dateTimeString);
      const formattedDate = dateObj.toLocaleString(); // Convierte el objeto Date a una cadena en formato legible
      return formattedDate;
    }

    const calculateElapsedTime = (startTime) => {
      const startDate = new Date(startTime).getTime(); // Convertir la fecha de inicio a milisegundos
      const currentDate = new Date().getTime(); // Obtener la fecha actual en milisegundos

      const elapsedTime = currentDate - startDate; // Calcular el tiempo transcurrido en milisegundos
      const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60)); // Convertir milisegundos a minutos
      const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000); // Calcular los segundos restantes

      return `${elapsedMinutes} minutos ${elapsedSeconds} segundos`; // Devolver el tiempo transcurrido en minutos y segundos
    };

    return () => clearInterval(intervalId);
  }, [selectedStation]);

  // Función para manejar el cambio en el estado del checkbox
  const handleCheckboxChange = (e) => {
    setShowButtons(e.target.checked); // Cambia el estado de showButtons según el estado del checkbox
  };

  // Función para formatear el tiempo en mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Función para manejar el clic en el botón de Play/Pause
  const handlePlayPauseClick = () => {
    if (!stations.includes(selectedStation)) {
      setMensaje("Por favor, seleccione una estación de trabajo");
      setShowPopup(true);
      return;
    }

    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      const startTime = Date.now() - elapsedTime;
      const id = setInterval(() => {
        const newElapsedTime = Date.now() - startTime;
        setElapsedTime(newElapsedTime);
        setTiempoSet(formatTime(Math.floor(newElapsedTime / 1000)));
      }, 1000);
      setIntervalId(id);
      setMensaje("Contador Iniciado");
    } else {
      clearInterval(intervalId);
      setMensaje("Contador Pausado");
    }
    setShowPopup(true);
  };

  // Función para manejar el clic en el botón de Stop
  const handleStopClick = () => {
    if (!isPlaying) {
      setShowPopup(true);
      setMensaje("Por favor, inicie el contador antes de detenerlo");
      return;
    }

    // Obtener la fecha y hora actual
    const now = new Date();
    const fecha = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    const hora = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    // Datos a enviar a la base de datos
    const usuario = `${selectedStation}`;
    const evento = "Set Terminado";
    const descripcion = `Tiempo total de armado del Set: ${tiempoSet}`;

    // Enviar datos a la base de datos mediante POST
    fetch("http://192.168.0.100:5000/sets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, evento, descripcion, fecha, hora }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud POST");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos enviados correctamente a la base de datos:", data);
      })
      .catch((error) => {
        console.error("Error al enviar datos a la base de datos:", error);
      });

    // Detener el contador y mostrar el mensaje
    setIsPlaying(false);
    clearInterval(intervalId);
    setElapsedTime(0);
    setTiempoSet("00:00");
    setShowPopup(true);
    setMensaje("Contador Detenido");
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="ESTADO DE PRODUCCIÓN" />
      <div className="container-conteo">
        <div className="contenedor-label1">
          <span className="elemento-label">
            Seleccione la estación de interés:
          </span>
          <select
            className="elemento-valor"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {stations.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
        <div className="contenedor-label1">
          <input
            type="checkbox"
            id="checklist"
            className="custom-checkbox-estado"
            onChange={handleCheckboxChange} // Maneja el cambio en el checkbox
          />
          <span className="elemento-label">Estación Ensamble</span>
        </div>

        {showButtons && (
          <div className="contenedor-label1">
            <div>
              <span className="elemento-label">Construcción De Set</span>
              <button
                className="bottom-time-estado"
                onClick={handlePlayPauseClick}
              >
                <img
                  src={isPlaying ? IconPause : IconPlay}
                  alt="Play/Pause"
                  className="icono-svg"
                />
              </button>
              <button className="bottom-time-estado" onClick={handleStopClick}>
                <img src={IconStop} alt="Stop" className="icono-svg" />
              </button>
              <span className="elemento-valor">{tiempoSet}</span>
            </div>
          </div>
        )}
      </div>
      <div className="contenido-columnas">
        <div className="tabla-columna">
          <table className="estado">
            <thead>
              <tr>
                <th className="estado">ID</th>
                <th className="estado">KIT</th>
                <th className="estado">Hora de entrada a la estación</th>
                <th className="estado">Tiempo Transcurrido</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="estado">{item.ID}</td>
                  <td className="estado">{item.Kit}</td>
                  <td className="estado">{item.fechaIngreso}</td>
                  <td className="estado">{item.TiempoTranscurrido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pdf-columna">
          <div className="pdf-container">
            <embed
              src={Instructivo}
              type="application/pdf"
              width="100%"
              height="400px"
            />
          </div>
        </div>
        <Popup
          mensaje={mensaje}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      </div>
    </div>
  );
}

export default Estado;
