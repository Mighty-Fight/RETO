import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./Asignacion.css";
import Header from '../components/header';
import axios from "axios";

const Asignacion = () => {
  const [tags, setTags] = useState([]);
  const [nombresKits, setNombresKits] = useState({});
  const [idsKits, setIdsKits] = useState({});

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://192.168.0.100:5000/tag");

        if (response.data.length > 0) {
          const initialNombresKits = {};
          const initialIdsKits = {};
          for (const tag of response.data) {
            initialNombresKits[tag] = await fetchNombreKit(tag); // Obtener nombres de kits
            initialIdsKits[tag] = await fetchIdKit(tag); // Obtener IDs de kits
          }
          setTags(response.data);
          setNombresKits(initialNombresKits);
          setIdsKits(initialIdsKits);
        } else {
          setTags(["No hay tags disponibles"]);
        }
      } catch (error) {
        console.error("Error al obtener los tags:", error);
        setTags(["Error al obtener los tags"]);
      }
    };

    const fetchNombreKit = async (tag) => {
      try {
        const nombreKitResponse = await axios.get(
          `http://192.168.0.100:5000/nombrekit/${tag}`
        );
        return nombreKitResponse.data || "";
      } catch (error) {
        console.error(`Error al obtener el nombre del kit para el tag ${tag}:`, error);
        return "";
      }
    };

    const fetchIdKit = async (tag) => {
      try {
        const idKitResponse = await axios.get(
          `http://192.168.0.100:5000/idkit/${tag}`
        );
        return idKitResponse.data || "";
      } catch (error) {
        console.error(`Error al obtener el ID del kit para el tag ${tag}:`, error);
        return "";
      }
    };

    fetchTags();

    const interval = setInterval(fetchTags, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleNombreKitChange = (event, tag) => {
    setNombresKits({ ...nombresKits, [tag]: event.target.value });
  };

  const handleGuardarNombreKit = async (tag) => {
    try {
      await axios.post(`http://192.168.0.100:5000/nombrekit/${tag}`, {
        nombreKit: nombresKits[tag],
      });
      console.log(`Nombre de kit para el tag ${tag} guardado correctamente`);
      setNombresKits({ ...nombresKits, [tag]: nombresKits[tag] });
    } catch (error) {
      console.error(`Error al guardar el nombre del kit para el tag ${tag}:`, error);
    }
  };

  const handleIdKitChange = (event, tag) => {
    setIdsKits({ ...idsKits, [tag]: event.target.value });
  };

  const handleGuardarIdKit = async (tag) => {
    try {
      await axios.post(`http://192.168.0.100:5000/idkit/${tag}`, {
        idKit: idsKits[tag],
      });
      console.log(`ID de kit para el tag ${tag} guardado correctamente`);
      setIdsKits({ ...idsKits, [tag]: idsKits[tag] });
    } catch (error) {
      console.error(`Error al guardar el ID del kit para el tag ${tag}:`, error);
    }
  };

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="Asignación Kits" />

      <div className="contenedor">
        {/* Sección para TAG LEIDO */}
        <div className="column">
          <div style={{ textAlign: "center", marginBottom: "10px" }}>KITS LEÍDOS</div>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <div key={index}>
                <span>{tag}</span>
              </div>
            ))
          ) : (
            <span>{tags[0]}</span>
          )}
        </div>

        {/* Sección para Nombre del Kit */}
        <div className="column">
          <div style={{ textAlign: "center", marginBottom: "10px" }}>NOMBRE DEL KIT</div>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={nombresKits[tag]}
                  onChange={(event) => handleNombreKitChange(event, tag)}
                  placeholder="Escribir nombre de kit"
                />
                <button onClick={() => handleGuardarNombreKit(tag)}>Guardar</button>
              </div>
            ))
          ) : (
            <span>{tags[0]}</span>
          )}
        </div>

        {/* Sección para ID DEL KIT */}
        <div className="column">
          <div style={{ textAlign: "center", marginBottom: "10px" }}>ID DEL KIT</div>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={idsKits[tag]}
                  onChange={(event) => handleIdKitChange(event, tag)}
                  placeholder="Escribir ID de kit"
                />
                <button onClick={() => handleGuardarIdKit(tag)}>Guardar</button>
              </div>
            ))
          ) : (
            <span>{tags[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Asignacion;
