 import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import LiveMap from "./LiveMap";
import Driver from "./Driver";

function StudentPage() {
  return (
    <div className="app">
      <a
  href="http://localhost:5173/harshitha/"
  style={{
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 2147483647,
    display: "block",
    visibility: "visible",
    opacity: 1,
    padding: "10px 18px",
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  }}
>
  ← Back to Home
</a>

      {/* HEADER */}
      <header className="topbar">

        <div>
          <h1>🚌 College Bus Live</h1>
          <p>Real-Time Bus Tracking</p>
        </div>

        <div className="header-actions">

          <div className="live-status">
            <span className="status-dot"></span>
            LIVE
          </div>

          <Link
            to="/driver"
            className="driver-button"
          >
            Driver Tracking
          </Link>

        </div>

      </header>


      {/* LIVE TRACKING */}
      <main className="dashboard">

        <section className="tracking-card">

          <div className="card-header">

            <div>
              <h2>Bus 01</h2>
              <p>SVCE College Route</p>
            </div>

            <span className="active-badge">
              ● Active
            </span>

          </div>

          {/* LiveMap contains:
              Map
              Current Location
              Next Stop
              ETA
              GPS Status
              Route Progress
          */}
          <LiveMap />

        </section>

      </main>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Student Live Tracking */}
        <Route
          path="/"
          element={<StudentPage />}
        />

        {/* Driver GPS Tracking */}
        <Route
          path="/driver"
          element={<Driver />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;