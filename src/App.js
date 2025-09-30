import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

// --- Configuración de Precios y Horarios ---
// (Fácil de editar en el futuro)
const CLASSIC_PRICE = 1.50;
const CHOCOLATE_PRICE = 2.00;
const OPENING_TIME = 8; // 8 AM
const CLOSING_TIME = 22; // 10 PM
const CLOSED_DAYS = [0]; // Domingo

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classicCount, setClassicCount] = useState(0);
  const [chocolateCount, setChocolateCount] = useState(0);
  const [pickupTime, setPickupTime] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- Cálculos ---
  const total = (classicCount * CLASSIC_PRICE) + (chocolateCount * CHOCOLATE_PRICE);
  const minPickupTime = new Date();
  minPickupTime.setHours(minPickupTime.getHours() + 6);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !phone || (classicCount === 0 && chocolateCount === 0) || !pickupTime) {
      setError("Por favor, completa todos los campos y selecciona al menos una medialuna.");
      return;
    }

    const orderData = {
      Timestamp: new Date().toISOString(),
      Nombre: name,
      Telefono: phone,
      Medialunas_Clasicas: classicCount,
      Medialunas_Chocolate: chocolateCount,
      Fecha_Entrega: pickupTime.toISOString(),
      Total_Pedido: total.toFixed(2), // Total añadido
    };
    
    // URL absoluta del webhook de n8n
    const webhookUrl = "https://n8n.srv943892.hstgr.cloud/webhook/bdfec8dd-7b6d-4206-ba4d-648ad5097138";

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Hubo un problema al enviar el pedido.");
      }

      setSuccess(`¡Gracias por tu pedido, ${name}! Lo recibimos correctamente.`);
      // Reset form
      setName("");
      setPhone("");
      setClassicCount(0);
      setChocolateCount(0);
      setPickupTime(null);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header bg-primary text-white text-center">
              <h3>Pedido para Luchos Bakerys</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Número de Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <hr />

                <div className="mb-3">
                  <label className="form-label">Medialunas Clásicas (${CLASSIC_PRICE.toFixed(2)} c/u)</label>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setClassicCount(Math.max(0, classicCount - 1))}>-</button>
                    <input type="text" className="form-control text-center" value={classicCount} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setClassicCount(classicCount + 1)}>+</button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Medialunas de Chocolate (${CHOCOLATE_PRICE.toFixed(2)} c/u)</label>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setChocolateCount(Math.max(0, chocolateCount - 1))}>-</button>
                    <input type="text" className="form-control text-center" value={chocolateCount} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setChocolateCount(chocolateCount + 1)}>+</button>
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <label htmlFor="pickupTime" className="form-label">Fecha y Hora de Entrega</label>
                  <DatePicker
                    id="pickupTime"
                    className="form-control"
                    selected={pickupTime}
                    onChange={(date) => setPickupTime(date)}
                    minDate={new Date()}
                    filterDate={date => !CLOSED_DAYS.includes(date.getDay())}
                    minTime={new Date(new Date().setHours(OPENING_TIME, 0))}
                    maxTime={new Date(new Date().setHours(CLOSING_TIME, 0))}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Selecciona una fecha y hora"
                    required
                  />
                   <div className="form-text">Horario: Lunes a Sábado de {OPENING_TIME}:00 a {CLOSING_TIME}:00. Se requiere 6hs de anticipación.</div>
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {total > 0 && (
                  <div className="text-center fs-4 my-3">
                    <strong>Total: ${total.toFixed(2)} USD</strong>
                  </div>
                )}

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Realizar Pedido</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;