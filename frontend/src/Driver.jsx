 import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Driver.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

function Driver() {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [serverConnected, setServerConnected] = useState(false);

  const watchId = useRef(null);

  useEffect(() => {
    // Check connection immediately
    setServerConnected(socket.connected);

    const handleConnect = () => {
      console.log("Connected to backend server");
      setServerConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from backend server");
      setServerConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("GPS is not supported by this browser.");
      return;
    }

    setError("");

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(newLocation);
        setTracking(true);

        socket.emit("bus-location", newLocation);

        console.log("Location sent:", newLocation);
      },
      (err) => {
        console.error("GPS Error:", err);
        setError(err.message);
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 15000,
      }
    );

    setTracking(true);
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    setTracking(false);
    setError("");

    console.log("GPS tracking stopped");
  };

  return (
    <div className="driver-page">

return (
    <div className="driver-page">

     {/* BACK TO HOME */}
<button
  onClick={() => {
    window.location.href = "/";
  }}
  style={{
    display: "block",
    margin: "20px 40px",
    padding: "10px 18px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    position: "relative",
    zIndex: 9999,
  }}
>
  ← Back to Home
</button>

      {/* HEADER */}
      <header className="driver-header">
        <div className="brand">
          <div className="brand-icon">🚌</div>

          <div>
            <h1>College Bus</h1>
            <p>Driver Dashboard</p>
          </div>
        </div>

        <div className="connection">
          <span
            className={
              serverConnected
                ? "online-dot"
                : "offline-dot"
            }
          ></span>

          {serverConnected
            ? "Server Connected"
            : "Server Offline"}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="driver-content">

        {/* WELCOME */}
        <section className="welcome-section">

          <div>
            <p className="small-label">
              DRIVER PANEL
            </p>

            <h2>
              Good Morning, Driver 👋
            </h2>

            <p className="subtitle">
              Manage your bus trip and share your live location.
            </p>
          </div>

          <div className="bus-number">
            <span>BUS</span>
            <strong>01</strong>
          </div>

        </section>

        {/* STATUS CARD */}
        <section className="status-card">

          <div className="status-top">

            <div>
              <p className="small-label">
                CURRENT STATUS
              </p>

              <h3>
                {tracking
                  ? "Live Tracking Active"
                  : "Trip Not Started"}
              </h3>
            </div>

            <div
              className={
                tracking
                  ? "live-badge"
                  : "inactive-badge"
              }
            >
              <span></span>

              {tracking
                ? "LIVE"
                : "OFFLINE"}
            </div>

          </div>

          <div className="status-line">

            {/* DRIVER */}
            <div className="status-step completed">

              <span>✓</span>

              <div>
                <strong>
                  Driver Login
                </strong>

                <small>
                  Verified
                </small>
              </div>

            </div>

            {/* SERVER */}
            <div
              className={
                serverConnected
                  ? "status-step completed"
                  : "status-step"
              }
            >

              <span>
                {serverConnected
                  ? "✓"
                  : "!"}
              </span>

              <div>
                <strong>
                  Server Connection
                </strong>

                <small>
                  {serverConnected
                    ? "Connected"
                    : "Waiting"}
                </small>
              </div>

            </div>

            {/* GPS */}
            <div
              className={
                tracking
                  ? "status-step completed"
                  : "status-step"
              }
            >

              <span>
                {tracking
                  ? "✓"
                  : "3"}
              </span>

              <div>
                <strong>
                  GPS Tracking
                </strong>

                <small>
                  {tracking
                    ? "Location sharing active"
                    : "Not started"}
                </small>
              </div>

            </div>

          </div>

        </section>

        {/* DASHBOARD GRID */}
        <section className="dashboard-grid">

          {/* LIVE LOCATION */}
          <div className="dashboard-card location-card">

            <div className="card-title">

              <div className="title-icon">
                📍
              </div>

              <div>
                <h3>
                  Live Location
                </h3>

                <p>
                  Real-time GPS coordinates
                </p>
              </div>

            </div>

            {location ? (

              <div className="coordinates">

                <div className="coordinate-box">

                  <span>
                    LATITUDE
                  </span>

                  <strong>
                    {location.latitude.toFixed(6)}
                  </strong>

                </div>

                <div className="coordinate-box">

                  <span>
                    LONGITUDE
                  </span>

                  <strong>
                    {location.longitude.toFixed(6)}
                  </strong>

                </div>

              </div>

            ) : (

              <div className="no-location">

                <div>
                  📡
                </div>

                <p>
                  Waiting for GPS location
                </p>

                <span>
                  Start tracking to receive your location
                </span>

              </div>

            )}

          </div>

          {/* CURRENT TRIP */}
          <div className="dashboard-card">

            <div className="card-title">

              <div className="title-icon">
                🛣️
              </div>

              <div>
                <h3>
                  Current Trip
                </h3>

                <p>
                  Bus route information
                </p>
              </div>

            </div>

            <div className="trip-route">

              <div className="route-point">

                <span className="route-dot start"></span>

                <div>
                  <small>
                    STARTING POINT
                  </small>

                  <strong>
                    SVCE College
                  </strong>
                </div>

              </div>

              <div className="route-line"></div>

              <div className="route-point">

                <span className="route-dot end"></span>

                <div>
                  <small>
                    DESTINATION
                  </small>

                  <strong>
                    Tirupati
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* TRIP CONTROL */}
        <section className="control-card">

          <div>

            <p className="small-label">
              TRIP CONTROL
            </p>

            <h3>
              {tracking
                ? "Your location is being shared"
                : "Ready to start your trip?"}
            </h3>

            <p>
              {tracking
                ? "Passengers can now see your live bus location."
                : "Start GPS tracking when you begin your route."}
            </p>

          </div>

          <div className="control-buttons">

            {!tracking ? (

              <button
                className="start-button"
                onClick={startTracking}
              >
                <span>▶</span>
                Start Trip
              </button>

            ) : (

              <button
                className="stop-button"
                onClick={stopTracking}
              >
                <span>■</span>
                Stop Trip
              </button>

            )}

          </div>

        </section>

        {/* ERROR */}
        {error && (

          <div className="error-card">

            <span>
              ⚠️
            </span>

            <div>

              <strong>
                GPS Issue
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}

      </main>

      {/* FOOTER */}
      <footer className="driver-footer">

        <span>
          College Bus Live Tracking
        </span>

        <span>
          Secure GPS • Real-Time Updates
        </span>

      </footer>

    </div>
  );
}

export default Driver;