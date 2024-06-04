import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import logo from "../Media/logo.png";
import "./Register.css";
export default function Register() {
  const [nombre, setNombre] = useState("");
  const [codigoEstudiantil, setCodigoEstudiantil] = useState("");
  const [nrc, setNRC] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(null);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorNRC, setErrorNRC] = useState(false);
  const [errorCodigoEstudiantil, setErrorCodigoEstudiantil] = useState(false); // Nuevo estado para el mensaje de error del código estudiantil
  const [camposVacios, setCamposVacios] = useState(false);
  const [usuarioExistente, setUsuarioExistente] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (nombre === "" || codigoEstudiantil === "" || nrc === "") {
      setCamposVacios(true);
      return;
    }

    if (errorNombre || errorNRC || errorCodigoEstudiantil) { // Agregamos errorCodigoEstudiantil aquí
      return;
    }

    try {
      await axios.post("http://192.168.0.100:5000/register", {
        nombre: nombre,
        codigoEstudiantil: codigoEstudiantil,
        nrc: nrc,
      });

      setRegistroExitoso("Registro exitoso");
      setNombre("");
      setCodigoEstudiantil("");
      setNRC("");
      setCamposVacios(false);
      setErrorNombre(false);
      setErrorNRC(false);
      setErrorCodigoEstudiantil(false); // Limpiar mensaje de error del código estudiantil
      setUsuarioExistente(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setUsuarioExistente(true);
      } else {
        console.error("Error al registrar el usuario:", error);
        setRegistroExitoso("Error de registro");
      }
    }
  };

  const validarNombre = () => {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/;
    if (!nombreRegex.test(nombre)) {
      setErrorNombre(true);
    } else {
      setErrorNombre(false);
    }
  };

  const validarNRC = () => {
    if (nrc !== "2168") {
      setErrorNRC(true);
    } else {
      setErrorNRC(false);
    }
  };

  const validarCodigoEstudiantil = () => {
    const codigoEstudiantilRegex = /^\d+$/; // Expresión regular para verificar si el código estudiantil solo contiene dígitos
    if (!codigoEstudiantilRegex.test(codigoEstudiantil)) {
      setErrorCodigoEstudiantil(true); // Si no pasa la validación, mostrar mensaje de error
    } else {
      setErrorCodigoEstudiantil(false); // Si pasa la validación, limpiar mensaje de error
    }
  };

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="register-box">
        <img src={logo} alt="Logo" />
        <form onSubmit={handleFormSubmit}>
          <label>NOMBRE:</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={validarNombre}
          />
          <label>CODIGO ESTUDIANTIL:</label>
          <input
            type="text"
            placeholder="Código estudiantil"
            value={codigoEstudiantil}
            onChange={(e) => setCodigoEstudiantil(e.target.value)}
            onBlur={validarCodigoEstudiantil} // Agregamos la función de validación aquí
          />
          {errorCodigoEstudiantil && <p className="error-message">Código estudiantil inválido</p>} {/* Mostrar mensaje de error */}
          <label>NRC:</label>
          <input
            type="text"
            placeholder="NRC"
            value={nrc}
            onChange={(e) => setNRC(e.target.value)}
            onBlur={validarNRC}
          />
          {camposVacios && (
            <p className="error-message">
              Error: Todos los campos son obligatorios
            </p>
          )}
          {errorNombre && <p className="error-message">Nombre no válido</p>}
          {errorNRC && <p className="error-message">NRC no válido</p>}
          {usuarioExistente && (
            <p className="error-message">El usuario ya está registrado</p>
          )}
          {registroExitoso && <p>{registroExitoso}</p>}
          <button type="submit">Registrar</button>
        </form>
        <Link to="/">
          <button type="button">Volver</button>
        </Link>
      </div>
    </>
  );
}
