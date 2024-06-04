import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Solicitud.css";
import { Link } from "react-router-dom";

export default function Picking() {
  const [numKits, setNumKits] = useState(0);
  const [disponibles, setDisponibles] = useState({});
  const [carrito, setCarrito] = useState({});

  useEffect(() => {
    // Obtener la información combinada de kits
    fetch("http://192.168.0.100:5000/kits_info")
      .then((response) => response.json())
      .then((data) => {
        console.log("Número de kits en Contenido:", data.contenidoCount);
        console.log("Disponibles:", data.disponibles);
        setNumKits(data.contenidoCount);
        setDisponibles(data.disponibles);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addToCart = (kitName) => {
    if (disponibles[kitName] > 0) {
      const updatedCart = { ...carrito };
      updatedCart[kitName] = updatedCart[kitName] ? updatedCart[kitName] + 1 : 1;
      setCarrito(updatedCart);

      const updatedDisponibles = { ...disponibles };
      updatedDisponibles[kitName] -= 1;
      setDisponibles(updatedDisponibles);
    } else {
      alert(`No hay disponibilidad de ${kitName}`);
    }
  };

  const removeFromCart = (kitName) => {
    if (carrito[kitName] > 0) {
      const updatedCart = { ...carrito };
      updatedCart[kitName] -= 1;
      setCarrito(updatedCart);

      const updatedDisponibles = { ...disponibles };
      updatedDisponibles[kitName] += 1;
      setDisponibles(updatedDisponibles);
    }
  };

  const enviarPedido = () => {
    const pedido = Object.keys(carrito).reduce((acc, kitName) => {
      const count = carrito[kitName];
      const kitNumber = kitName.replace(/\D/g, ''); // Eliminar todo lo que no sea número
      for (let i = 0; i < count; i++) {
        acc.push(kitNumber);
      }
      return acc;
    }, []);

    const nombreUsuario = "NombreDelUsuario"; // Reemplaza esto con el método correcto para obtener el nombre del usuario logueado

    // Enviar el pedido inicial
    fetch("http://192.168.0.100:5000/solicitar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nuevoPedido: pedido.join(","), nombreUsuario }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message); // Mostrar mensaje de éxito o error
        // Limpiar el carrito después de enviar el pedido
        setCarrito({});
        
      })
      .catch((error) => {
        console.error("Error al enviar el pedido:", error);
        alert("Error al enviar el pedido");
      });

  };

  return (
    <div style={{ overflowY: "auto" }}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="SOLICITUD DE MATERIALES" />

      <div className="container-items">
        <div className="kit-container">
          <h3>Total de Kits</h3>
          <p>{`Hay ${numKits} kits en total`}</p>
        </div>
        {[...Array(numKits)].map((_, index) => {
          const kitName = `Kit ${index + 1}`;
          return (
            <div key={index} className="kit-container">
              <h3>{kitName}</h3>
              <p>{`Disponibles: ${disponibles[kitName] !== undefined ? disponibles[kitName] : 0}`}</p>
              <div>
                <button onClick={() => addToCart(kitName)}>+</button>
                <span>{carrito[kitName] || 0}</span>
                <button onClick={() => removeFromCart(kitName)}>-</button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Link to="/pick">
        <button onClick={enviarPedido}>Enviar</button>
          </Link>
      </div>
    </div>
  );
}
