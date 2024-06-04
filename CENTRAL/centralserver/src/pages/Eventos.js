import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Eventos.css";

function Eventos() {
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [stationFilter, setStationFilter] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    solicitudes: false,
    ingresoMaterial: false,
    kitsArmados: false,
    asignacionKits: false,
    asignacionContenido: false,
    setsTerminados: false,
    salida: false,
    entrada: false,
  });
  const [filters, setFilters] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
  });

  const [filteredData, setFilteredData] = useState([]);
  const [selectedCheckboxCount, setSelectedCheckboxCount] = useState(0);
  const [selectedCheckboxText, setSelectedCheckboxText] = useState("Kits Armados");
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [showStationDropdown, setShowStationDropdown] = useState(false);

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
    document.body.classList.add("eventos-body");
    document.documentElement.classList.add("eventos-body");
    return () => {
      document.body.classList.remove("eventos-body");
      document.documentElement.classList.remove("eventos-body");
    };
  }, []);

  const fetchEventos = async () => {
    const selectedCheckboxes = Object.keys(checkboxes).filter(key => checkboxes[key]);

    if (selectedCheckboxes.length === 0) {
      setData([]);
      setFilteredData([]);
      setSelectedCheckboxCount(0);
      setShowStationDropdown(false);
      setSelectedCheckboxText("Kits Armados");
      setVisibleColumns([]);
      return;
    }

    try {
      const { fecha, horaInicio, horaFin } = filters;
      const query = new URLSearchParams({
        fecha,
        horaInicial: horaInicio,
        horaFinal: horaFin,
        solicitudes: checkboxes.solicitudes ? "true" : "",
        ingresoMaterial: checkboxes.ingresoMaterial ? "true" : "",
        kitsArmados: checkboxes.kitsArmados ? "true" : "",
        asignacionKits: checkboxes.asignacionKits ? "true" : "",
        asignacionContenido: checkboxes.asignacionContenido ? "true" : "",
        setsTerminados: checkboxes.setsTerminados ? "true" : "",
        salida: checkboxes.salida ? "true" : "",
        entrada: checkboxes.entrada ? "true" : "",
      }).toString();

      const response = await fetch(`http://192.168.0.100:5000/eventos?${query}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const eventosData = await response.json();
      setData(eventosData);
      setFilteredData(eventosData);
      setSelectedCheckboxCount(selectedCheckboxes.length);

      const onlyKitsOrSetsSelected = (checkboxes.kitsArmados || checkboxes.setsTerminados) &&
        !(checkboxes.solicitudes || checkboxes.ingresoMaterial || checkboxes.asignacionKits || checkboxes.asignacionContenido || checkboxes.salida || checkboxes.entrada);

      setShowStationDropdown(onlyKitsOrSetsSelected);

      if (checkboxes.ingresoMaterial) {
        setSelectedCheckboxText("Ingreso Material Total");
        setVisibleColumns(["Descripcion", "Fecha", "Hora"]);
      } else if (checkboxes.solicitudes) {
        setSelectedCheckboxText("Solicitudes Totales");
        setVisibleColumns(["Descripcion", "Fecha", "Hora"]);
      } else if (checkboxes.kitsArmados) {
        setSelectedCheckboxText("Kits Armados Totales");
        setVisibleColumns(["Usuario", "Descripcion", "Fecha", "Hora"]);
      } else if (checkboxes.asignacionKits) {
        setSelectedCheckboxText("Asignación de Kits Totales");
        setVisibleColumns(["Descripcion", "Fecha", "Hora"]);
      } else if (checkboxes.asignacionContenido) {
        setSelectedCheckboxText("Asignación de Contenido Total");
        setVisibleColumns(["Descripcion", "Fecha", "Hora"]);
      } else if (checkboxes.setsTerminados) {
        setSelectedCheckboxText("Sets Terminados Totales");
        setVisibleColumns(["Usuario", "Descripcion", "Fecha", "Hora"]);
      } else if (checkboxes.salida) {
        setSelectedCheckboxText("Salida Total");
        setVisibleColumns(["Descripcion", "Fecha", "Hora"]);
      } else if (checkboxes.entrada) {
        setSelectedCheckboxText("Entrada Total");
        setVisibleColumns(["Descripcion", "Fecha", "Hora"]);
      } else {
        setSelectedCheckboxText("Kits Armados");
        setVisibleColumns([]);
      }

      if (selectedCheckboxes.length >= 2) {
        setVisibleColumns(prevColumns => ["Evento", ...prevColumns]);
      }

      // Apply station filter only when fetching new data and only if the condition is met
      if (onlyKitsOrSetsSelected) {
        setStationFilter(selectedStation);
      } else {
        setStationFilter("");
      }

      console.log("Consulta a Eventos exitosa");
    } catch (error) {
      console.error("Error fetching data for Eventos:", error);
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    if (name === "fecha") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        fecha: value,
        horaInicio: "",
        horaFin: "",
      }));
    } else if (name === "horaInicio") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        horaInicio: value,
        horaFin: "",
      }));
    } else if (name === "horaFin") {
      if (value >= filters.horaInicio) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          horaFin: value,
        }));
      }
    }
  };

  const handleConsultaClick = () => {
    fetchEventos();
  };

  const handleStationChange = (event) => {
    const { value } = event.target;
    setSelectedStation(value);
  };

  const getFilteredDataByStation = () => {
    if (stationFilter && stationFilter !== "Seleccionar") {
      return filteredData.filter(item => item.usuario === stationFilter);
    }
    return filteredData;
  };

  const renderTableHeaders = () => {
    return visibleColumns.map((column, index) => (
      <th key={index}>{column}</th>
    ));
  };

  const renderTableRows = () => {
    const filteredByStation = getFilteredDataByStation();
    return filteredByStation.map((item, index) => (
      <tr key={index}>
        {visibleColumns.includes("Evento") && <td>{item.evento}</td>}
        {visibleColumns.includes("Usuario") && <td>{item.usuario}</td>}
        {visibleColumns.includes("Descripcion") && <td>{item.descripcion}</td>}
        {visibleColumns.includes("Fecha") && <td>{item.fecha.split('T')[0]}</td>}
        {visibleColumns.includes("Hora") && <td>{item.hora}</td>}
      </tr>
    ));
  };

  return (
    <div className="eventos-wrapper">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="CONSULTA DE EVENTOS" />
      <div className="eventos-container-titulo">
        
      </div>

      <div className="eventos-container">
        <div className="eventos-container-checkboxes">
          <h2 className="eventos-titulo-evento">Seleccione evento de interés</h2>
          <div className="eventos-contenedor-label1">
            <label>
              <input
                type="checkbox"
                name="solicitudes"
                checked={checkboxes.solicitudes}
                onChange={handleCheckboxChange}
              />
              Solicitudes
            </label>

            <label>
              <input
                type="checkbox"
                name="ingresoMaterial"
                checked={checkboxes.ingresoMaterial}
                onChange={handleCheckboxChange}
              />
              Ingreso Material
            </label>

            <label>
              <input
                type="checkbox"
                name="kitsArmados"
                checked={checkboxes.kitsArmados}
                onChange={handleCheckboxChange}
              />
              Kits Armados
            </label>

            <label>
              <input
                type="checkbox"
                name="asignacionKits"
                checked={checkboxes.asignacionKits}
                onChange={handleCheckboxChange}
              />
              Asignación de Kits
            </label>

            <label>
              <input
                type="checkbox"
                name="asignacionContenido"
                checked={checkboxes.asignacionContenido}
                onChange={handleCheckboxChange}
              />
              Asignación de Contenido
            </label>

            <label>
              <input
                type="checkbox"
                name="setsTerminados"
                checked={checkboxes.setsTerminados}
                onChange={handleCheckboxChange}
              />
              Sets Terminados
            </label>

            <label>
              <input
                type="checkbox"
                name="salida"
                checked={checkboxes.salida}
                onChange={handleCheckboxChange}
              />
              Salida
            </label>

            <label>
              <input
                type="checkbox"
                name="entrada"
                checked={checkboxes.entrada}
                onChange={handleCheckboxChange}
              />
              Entrada
            </label>
          </div>
        </div>

        <div className="eventos-container-filtros">
          <div className="eventos-contenedor-label1">
            <label>
              Fecha:
              <input
                type="date"
                name="fecha"
                value={filters.fecha}
                onChange={handleFilterChange}
              />
            </label>

            <label>
              Hora de inicio:
              <input
                type="time"
                name="horaInicio"
                value={filters.horaInicio}
                onChange={handleFilterChange}
                disabled={!filters.fecha}
              />
            </label>

            <label>
              Hora de fin:
              <input
                type="time"
                name="horaFin"
                value={filters.horaFin}
                onChange={handleFilterChange}
                disabled={!filters.horaInicio}
                min={filters.horaInicio}
              />
            </label>
          </div>
          <div className="eventos-container-boton-consulta">
            <button className="eventos-bottom-time-estado" onClick={handleConsultaClick}>Consultar</button>
          </div>
        </div>
      </div>

      {filteredData.length > 0 && selectedCheckboxCount === 1 && (
        <div className="eventos-container-conteo">
          <div className="eventos-contenedor-label1">
            <span className="eventos-elemento-label">{selectedCheckboxText}:</span>
            <span className="eventos-elemento-valor">
              {stationFilter && stationFilter !== "Seleccionar"
                ? getFilteredDataByStation().length
                : filteredData.length}
            </span>
          </div>
        </div>
      )}

      {showStationDropdown && (
        <div className="eventos-container-conteo">
          <div className="eventos-contenedor-label1">
            <span className="eventos-elemento-label">Seleccione la estación de interés:</span>
            <select
              className="eventos-elemento-valor"
              value={selectedStation}
              onChange={handleStationChange}
            >
              <option value="Seleccionar">Seleccionar</option>
              {stations.map((station, index) => (
                <option key={index} value={`Estación ${index + 1}`}>
                  Estación {index + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="eventos-tabla-container">
          <h2 className="eventos-titulo-evento">REGISTRO DE EVENTOS:</h2>
          <table className="eventos-tabla-eventos">
            <thead>
              <tr>
                {renderTableHeaders()}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Eventos;
