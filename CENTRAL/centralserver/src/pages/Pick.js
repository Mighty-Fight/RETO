import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Pick.css";

function Pick() {
  const [rfidText, setRfidText] = useState("");
  const [epValue, setEpValue] = useState("");
  const [pedidoRealizado, setPedidoRealizado] = useState([]);
  const [piezasPorVerificar, setPiezasPorVerificar] = useState([]);
  const [piezasVerificadas, setPiezasVerificadas] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [initialPedidoRealizado, setInitialPedidoRealizado] = useState([]);

  const textAreaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRfidText("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [epValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 6100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUltimoPedido();

    const interval = setInterval(() => {
      if (piezasPorVerificar.length > 0) {
        fetchUltimoPedido();
      }
    }, 5000); // Consulta cada 5 segundos

    return () => clearInterval(interval);
  }, [piezasPorVerificar, initialPedidoRealizado.length]);

  const fetchUltimoPedido = () => {
    fetch("http://localhost:5000/ultimoPedido")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const pedido = data.pedidoRealizado;
        if (pedido) {
          const kits = pedido.split(",").map((num) => `Kit ${num}`);
          if (initialPedidoRealizado.length === 0) {
            setPiezasPorVerificar(kits);
            setInitialPedidoRealizado(kits);
          } else {
            const newKits = initialPedidoRealizado.filter((kit) => !kits.includes(kit));
            setPiezasVerificadas((prevState) => [...prevState, ...newKits]);
            setPiezasPorVerificar(kits);
          }
        }
      })
      .catch((error) => {
        console.error("There was an error with the fetch operation:", error);
      });
  };

  const searchEP = (text) => {
    const regex = /EP:\s*([A-Z0-9]+)/;
    const match = text.match(regex);
    if (match) {
      setEpValue(match[1]);
      updateInventory(match[1]);
    } else {
      setEpValue("");
    }
  };

  const updateInventory = (ep) => {
    fetch("http://localhost:5000/actualizarInventario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EP: ep }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        setTimeout(fetchUltimoPedido, 5000);
      })
      .catch((error) => {
        console.error("There was an error with the fetch operation:", error);
      });
  };

  const handleRfidTextChange = (event) => {
    const text = event.target.value.slice(0, 36);
    setRfidText(text);

    if (text.length === 36) {
      searchEP(text);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPedidoRealizado([]);
    setPiezasPorVerificar([]);
    setPiezasVerificadas([]);
    setPostCount(0);
    setInitialPedidoRealizado([]);

    // Realizar el POST al backend para cancelar el pedido
    fetch("http://localhost:5000/cancelarPedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Log para verificar en la consola del navegador
      })
      .catch((error) => {
        console.error("There was an error with the fetch operation:", error);
      });
  };

  return (
    <div id="root">
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
      <div>
        <Header titulo="VERIFICACIÓN PICK TO LIGHT" />
        <div className="input-container">
          <h3 htmlFor="rfidText">Escanea el tag RFID:</h3>
          <textarea
            id="rfidText"
            className="textarea-pick"
            ref={textAreaRef}
            rows="2"
            cols="50"
            maxLength="36"
            value={rfidText}
            onChange={handleRfidTextChange}
          />
          <p>Último EP encontrado: {epValue}</p>
        </div>
        <div></div>
        <div className="status-container">
          <div className="status-box">
            <h3>Piezas por verificar:</h3>
            <p>{piezasPorVerificar.join(", ")}</p>
          </div>
          <div className="status-box">
            <h3>Piezas verificadas:</h3>
            <p>{piezasVerificadas.join(", ")}</p>
          </div>
        </div>
        {popupVisible && (
          <div className="popup">
            <div className="popup-content">
              <h2>PICK TO LIGHT COMPLETO</h2>
              <button onClick={closePopup}>Cerrar</button>
            </div>
          </div>
        )}
        <div style={{ textAlign: "center", margin: "20px" }}>
          <button onClick={closePopup}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default Pick;
