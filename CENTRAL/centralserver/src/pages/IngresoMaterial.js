import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import Header from "../components/header";
import "./IngresoMaterial.css";
import { Link } from "react-router-dom";



function Ingresomaterial() {
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState('1');
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo edición

  useEffect(() => {
    if (!isEditing) {
      fetchData(selectedStation);
      const interval = setInterval(() => fetchData(selectedStation), 2000); // Actualiza cada 5 segundos
      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente o cambiar el modo
    }
  }, [selectedStation, isEditing]);

  const fetchData = async (stationNumber) => {
    try {
      const response = await fetch(`http://192.168.0.100:5000/estaciones/${stationNumber}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const result = await response.json();
      setData(result.map(item => ({ id: item.ID, bahia: item.Bahia || '' })));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsEditing(e.target.checked); // Cambia el modo según el estado del checkbox

  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedData = data.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setData(updatedData);
  };

  const handleSaveChanges = () => {
    fetch('http://192.168.0.100:5000/guardarCambios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar los cambios');
        }
        return response.json();
      })
      .then(updatedData => {
        console.log('Datos guardados:', updatedData);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  };

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="Ingreso de material" />
      <div className="container-Ingreso">
        <div className="contenedor-labelingreso">
          <span className="elemento-labelingreso"></span>
          <input
            type="checkbox"
            id="checklist"
            className="custom-checkbox-estado"
            onChange={handleCheckboxChange} // Maneja el cambio en el checkbox
          />
          <span className="elemento-label"> Estado de Edición</span>
        </div>
        <div className="container-estacion" style={{ textAlign: 'left' }}>
          <span>Seleccione la estación de interés:</span>
          <select
            className="elemento-valor"
            value={selectedStation}
            onChange={handleStationChange}
          >
            <option value="1">Estación 1</option>
            <option value="2">Estación 2</option>
            <option value="3">Estación 3</option>
          </select>
          <Link to="/pick2">
            <button className="boton-ingreso"
              onClick={handleSaveChanges}>Guardar Cambios</button>
          </Link>
        </div>
      </div>
      <div className="container-ingreso">
        <div className="header">
          <div className="header-item">ID</div>
          <div className="header-item">Bahía</div>
        </div>
        {data.map((item, index) => (
          <div className="row" key={index}>
            <div className="cell">{item.id}</div>
            <div className="cell">
              <input
                type="text"
                name="bahia"
                value={item.bahia}
                onChange={(e) => handleInputChange(index, e)}
                placeholder={item.bahia}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Ingresomaterial;
