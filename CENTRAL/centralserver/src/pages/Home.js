// Home.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import logo from "../Media/logo.png";
import uninorte from "../Media/uninorte.png";
import "./Home.css";

export default function Home({ setIsAuthenticated }) {
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige a home.js al cargar la página
    navigate("/");
  }, [navigate]); // Este efecto se ejecutará solo una vez al cargar la página

  const handleInputChange = (e) => {
    setUsuario(e.target.value);
  };

  const verificarUsuario = async () => {
    if (!usuario) {
      setMensaje("Ingrese un usuario válido");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.100:5000/verificarUsuario",
        {
          codigoEstudiantil: usuario,
        }
      );

      setMensaje(response.data.mensaje);

      // Si el usuario es encontrado en la base de datos, establece el estado de autenticación a verdadero
      if (response.data.mensaje === "Usuario encontrado") {
        setIsAuthenticated(true);
        // Redirige al usuario a la página de menú después de la autenticación exitosa
        navigate("/menu");
      }
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
      setMensaje("Error al verificar el usuario");
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
      <div className="home-box">
        <img src={logo} alt="Logo" />
        <h3>PORTAL DE GESTION INDUSTRIAL</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verificarUsuario();
          }}
        >
          <h4>INGRESE SU CODIGO ESTUDIANTIL:</h4>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={handleInputChange}
            autoFocus
          />
          <button type="submit">Iniciar Sesión</button>
          {mensaje && <p>{mensaje}</p>}
        </form>
        <a href="/register">
          <button type="button">Registrarse</button>
        </a>
      </div>
      <div className="container-uninorte">
        <img src={uninorte} alt="Uninorte" />
      </div>
    </>
  );
}
