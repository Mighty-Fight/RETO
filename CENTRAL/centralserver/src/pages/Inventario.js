import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from '../components/header';
import "./Inventario.css";

function Inventario() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://192.168.0.100:5000/michi")
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo obtener la respuesta del servidor");
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => console.error("Error:", error));
    };

    fetchData(); // Fetch data initially
    const interval = setInterval(fetchData, 2000); // Set interval to fetch data every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <Helmet>

      </Helmet>
      <Header titulo="INVENTARIO" />
      <div className="container-inventario">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tag</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Bahia</th>
              <th>Hora de entrada al laboratorio</th>
              <th>Hora de salida del laboratorio</th>
              <th>inventario</th>
              <th>Hora de entrada a bodega</th>
              <th>Hora de salida de la  bodega</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ID}</td>
                <td>{item.Tag}</td>
                <td>{item.Nombre}</td>
                <td>{item.Cantidad}</td>
                <td>{item.Bahia}</td>
                <td>{item.Hora_entrada_lab}</td>
                <td>{item.Hora_salida_lab}</td>
                <td>{item.INV}</td>
                <td>{item.Hora_entrada_bodega}</td>
                <td>{item.Hora_salida_bodega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventario;
