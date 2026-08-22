
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Driver from "./Driver";
import LiveMap from "./LiveMap";
import {
  Bus,
  Map,
  MapPin,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react";
import "./App.css";

const API = "https://college-bus-live-route-assistant-updated.onrender.com/api";


function AdminDashboard() {
 
  const [activeTab, setActiveTab] = useState("buses");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);

  

  const [busForm, setBusForm] = useState({
    busNumber: "",
    registrationNumber: "",
    driverName: "",
    routeName: "",
    status: "Active",
  });

  const [routeForm, setRouteForm] = useState({
    routeName: "",
    startPoint: "",
    destination: "",
    stops: [],
    status: "Active",
  });

  const [stopForm, setStopForm] = useState({
    stopName: "",
    location: "",
    routeName: "",
    latitude: "",
    longitude: "",
    stopOrder: "",
  });

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);

      const [busRes, routeRes, stopRes] = await Promise.all([
        fetch(`${API}/buses`),
        fetch(`${API}/routes`),
        fetch(`${API}/stops`),
      ]);

      if (!busRes.ok || !routeRes.ok || !stopRes.ok) {
        throw new Error("Failed to load data");
      }

      const busData = await busRes.json();
      const routeData = await routeRes.json();
      const stopData = await stopRes.json();

      setBuses(Array.isArray(busData) ? busData : []);
      setRoutes(Array.isArray(routeData) ? routeData : []);
      setStops(Array.isArray(stopData) ? stopData : []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);



  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    setShowForm(false);
  };

  // =========================
  // DELETE
  // =========================

  const deleteItem = async (type, id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${type}?`
    );

    if (!confirmed) return;

    try {
      const endpoint = {
        bus: "buses",
        route: "routes",
        stop: "stops",
      }[type];

      const response = await fetch(`${API}/${endpoint}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      alert(data.message || "Deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    }
  };

  // =========================
  // ADD BUS
  // =========================

  const addBus = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/buses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(busForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add bus");
        return;
      }

      alert("Bus added successfully!");

      setBusForm({
        busNumber: "",
        registrationNumber: "",
        driverName: "",
        routeName: "",
        status: "Active",
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Add bus error:", error);
      alert("Failed to add bus");
    }
  };

  // =========================
  // EDIT BUS
  // =========================

  const editBus = async (id, bus) => {
    const busNumber = window.prompt(
      "Enter Bus Number:",
      bus.busNumber || ""
    );

    if (busNumber === null) return;

    const registrationNumber = window.prompt(
      "Enter Registration Number:",
      bus.registrationNumber || ""
    );

    if (registrationNumber === null) return;

    const driverName = window.prompt(
      "Enter Driver Name:",
      bus.driverName || ""
    );

    if (driverName === null) return;

    const routeName = window.prompt(
      "Enter Route Name:",
      bus.routeName || ""
    );

    if (routeName === null) return;

    const status = window.prompt(
      "Enter Status (Active/Inactive):",
      bus.status || "Active"
    );

    if (status === null) return;

    const updatedBus = {
      busNumber,
      registrationNumber,
      driverName,
      routeName,
      status,
    };

    try {
      const response = await fetch(`${API}/buses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBus),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update bus");
        return;
      }

      alert("Bus updated successfully!");
      await loadData();
    } catch (error) {
      console.error("Edit bus error:", error);
      alert("Failed to update bus");
    }
  };

  // =========================
  // ADD ROUTE
  // =========================

  const addRoute = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add route");
        return;
      }

      alert("Route added successfully!");

      setRouteForm({
        routeName: "",
        startPoint: "",
        destination: "",
        stops: [],
        status: "Active",
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Add route error:", error);
      alert("Failed to add route");
    }
  };

  // =========================
  // EDIT ROUTE
  // =========================

  const editRoute = async (id, route) => {
    const routeName = window.prompt(
      "Enter Route Name:",
      route.routeName || ""
    );

    if (routeName === null) return;

    const startPoint = window.prompt(
      "Enter Start Point:",
      route.startPoint || ""
    );

    if (startPoint === null) return;

    const destination = window.prompt(
      "Enter Destination:",
      route.destination || route.endPoint || ""
    );

    if (destination === null) return;

    const status = window.prompt(
      "Enter Status (Active/Inactive):",
      route.status || "Active"
    );

    if (status === null) return;

    const updatedRoute = {
      routeName,
      startPoint,
      destination,
      stops: route.stops || [],
      status,
    };

    try {
      const response = await fetch(`${API}/routes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRoute),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update route");
        return;
      }

      alert("Route updated successfully!");
      await loadData();
    } catch (error) {
      console.error("Edit route error:", error);
      alert("Failed to update route");
    }
  };

  // =========================
  // ADD STOP
  // =========================

  const addStop = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/stops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...stopForm,
          latitude: Number(stopForm.latitude),
          longitude: Number(stopForm.longitude),
          stopOrder: Number(stopForm.stopOrder),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add stop");
        return;
      }

      alert("Stop added successfully!");

      setStopForm({
        stopName: "",
        location: "",
        routeName: "",
        latitude: "",
        longitude: "",
        stopOrder: "",
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Add stop error:", error);
      alert("Failed to add stop");
    }
  };

  // =========================
  // EDIT STOP
  // =========================

  const editStop = async (id, stop) => {
    const stopName = window.prompt(
      "Enter Stop Name:",
      stop.stopName || ""
    );

    if (stopName === null) return;

    const location = window.prompt(
      "Enter Location:",
      stop.location || ""
    );

    if (location === null) return;

    const routeName = window.prompt(
      "Enter Route Name:",
      stop.routeName || ""
    );

    if (routeName === null) return;

    const latitude = window.prompt(
      "Enter Latitude:",
      stop.latitude ?? ""
    );

    if (latitude === null) return;

    const longitude = window.prompt(
      "Enter Longitude:",
      stop.longitude ?? ""
    );

    if (longitude === null) return;

    const stopOrder = window.prompt(
      "Enter Stop Order:",
      stop.stopOrder ?? 1
    );

    if (stopOrder === null) return;

    const updatedStop = {
      stopName,
      location,
      routeName,
      latitude: Number(latitude),
      longitude: Number(longitude),
      stopOrder: Number(stopOrder),
    };

    if (
      !updatedStop.stopName ||
      !updatedStop.location ||
      !updatedStop.routeName ||
      Number.isNaN(updatedStop.latitude) ||
      Number.isNaN(updatedStop.longitude) ||
      Number.isNaN(updatedStop.stopOrder)
    ) {
      alert("Please enter valid stop details.");
      return;
    }

    try {
      const response = await fetch(`${API}/stops/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStop),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update stop");
        return;
      }

      alert("Stop updated successfully!");
      await loadData();
    } catch (error) {
      console.error("Edit stop error:", error);
      alert("Failed to update stop");
    }
  };

  // =========================
  // CHANGE TAB
  // =========================

  const changeTab = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">
        <div className="logo">
          <Bus size={30} />

          <div>
            <span className="logo-title">College Bus</span>
            <span className="logo-subtitle">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === "buses" ? "active" : ""}
            onClick={() => changeTab("buses")}
          >
            <Bus size={20} />
            <span>Buses</span>
          </button>

          <button
            className={activeTab === "routes" ? "active" : ""}
            onClick={() => changeTab("routes")}
          >
            <Map size={20} />
            <span>Routes</span>
          </button>

          <button
            className={activeTab === "stops" ? "active" : ""}
            onClick={() => changeTab("stops")}
          >
            <MapPin size={20} />
            <span>Stops</span>
          </button>
        </nav>
        
   <button
  className="sidebar-nav-button"
  onClick={() => {
    window.location.href = "/live-tracking";
  }}
>
  <Map size={20} />
  <span>Live Tracking</span>
</button>

<button
  className="sidebar-nav-button"
  onClick={() => {
    window.location.href = "/hema/";
  }}
>
  <Bus size={20} />
  <span>Driver</span>
</button>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="main">

        {/* ================= TOP HEADER ================= */}

        <header className="header">
          <button
  className="back-home"
  onClick={() => {
    window.location.href = "/harshitha/";
  }}
>
  ← Back to Home
</button>
          <div className="header-title">
            <h1>College Bus Admin</h1>

            <p>
              Manage buses, routes and stops
            </p>
          </div>

          <button
            className="refresh"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={loading ? "spin" : ""}
            />

            {loading ? "Loading..." : "Refresh"}
          </button>
          
        </header>

        {/* ================= DASHBOARD CARDS ================= */}

        <section className="cards">

          <div className="card">
            <div className="card-icon">
              <Bus size={26} />
            </div>

            <div className="card-info">
              <span>Total Buses</span>
              <strong>{buses.length}</strong>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">
              <Map size={26} />
            </div>

            <div className="card-info">
              <span>Total Routes</span>
              <strong>{routes.length}</strong>
            </div>
          </div>

          <div className="card">
            <div className="card-icon">
              <MapPin size={26} />
            </div>

            <div className="card-info">
              <span>Total Stops</span>
              <strong>{stops.length}</strong>
            </div>
          </div>

        </section>



        {/* ================= CONTENT ================= */}

        <section className="content">

          {/* ================= CONTENT HEADER ================= */}

          <div className="content-header">

            <div className="content-heading">
              <h2>
                {activeTab === "buses" && "Bus Management"}
                {activeTab === "routes" && "Route Management"}
                {activeTab === "stops" && "Stop Management"}
              </h2>

              <p>
                View and manage your college transportation data.
              </p>
            </div>

            <button
              className="add-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />

              <span>
                Add{" "}
                {activeTab === "buses"
                  ? "Bus"
                  : activeTab === "routes"
                  ? "Route"
                  : "Stop"}
              </span>
            </button>

          </div>

          {/* ================= BUS FORM ================= */}

          {showForm && activeTab === "buses" && (
            <div className="form-box">

              <div className="form-title">
                <h3>Add New Bus</h3>
                <p>Enter the details of the new bus.</p>
              </div>

              <form
                className="management-form"
                onSubmit={addBus}
              >

                <div className="form-field">
                  <label>Bus Number</label>

                  <input
                    type="text"
                    placeholder="Enter bus number"
                    value={busForm.busNumber}
                    onChange={(e) =>
                      setBusForm({
                        ...busForm,
                        busNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Registration Number</label>

                  <input
                    type="text"
                    placeholder="Enter registration number"
                    value={busForm.registrationNumber}
                    onChange={(e) =>
                      setBusForm({
                        ...busForm,
                        registrationNumber:
                          e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Driver Name</label>

                  <input
                    type="text"
                    placeholder="Enter driver name"
                    value={busForm.driverName}
                    onChange={(e) =>
                      setBusForm({
                        ...busForm,
                        driverName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Route Name</label>

                  <input
                    type="text"
                    placeholder="Enter route name"
                    value={busForm.routeName}
                    onChange={(e) =>
                      setBusForm({
                        ...busForm,
                        routeName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Status</label>

                  <select
                    value={busForm.status}
                    onChange={(e) =>
                      setBusForm({
                        ...busForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-button"
                  >
                    Save Bus
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* ================= ROUTE FORM ================= */}

          {showForm && activeTab === "routes" && (
            <div className="form-box">

              <div className="form-title">
                <h3>Add New Route</h3>
                <p>Enter the details of the new route.</p>
              </div>

              <form
                className="management-form"
                onSubmit={addRoute}
              >

                <div className="form-field">
                  <label>Route Name</label>

                  <input
                    type="text"
                    placeholder="Enter route name"
                    value={routeForm.routeName}
                    onChange={(e) =>
                      setRouteForm({
                        ...routeForm,
                        routeName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Start Point</label>

                  <input
                    type="text"
                    placeholder="Enter start point"
                    value={routeForm.startPoint}
                    onChange={(e) =>
                      setRouteForm({
                        ...routeForm,
                        startPoint: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Destination</label>

                  <input
                    type="text"
                    placeholder="Enter destination"
                    value={routeForm.destination}
                    onChange={(e) =>
                      setRouteForm({
                        ...routeForm,
                        destination: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Status</label>

                  <select
                    value={routeForm.status}
                    onChange={(e) =>
                      setRouteForm({
                        ...routeForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-button"
                  >
                    Save Route
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* ================= STOP FORM ================= */}

          {showForm && activeTab === "stops" && (
            <div className="form-box">

              <div className="form-title">
                <h3>Add New Stop</h3>
                <p>Enter the details of the new stop.</p>
              </div>

              <form
                className="management-form"
                onSubmit={addStop}
              >

                <div className="form-field">
                  <label>Stop Name</label>

                  <input
                    type="text"
                    placeholder="Enter stop name"
                    value={stopForm.stopName}
                    onChange={(e) =>
                      setStopForm({
                        ...stopForm,
                        stopName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Location</label>

                  <input
                    type="text"
                    placeholder="Enter location"
                    value={stopForm.location}
                    onChange={(e) =>
                      setStopForm({
                        ...stopForm,
                        location: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Route Name</label>

                  <input
                    type="text"
                    placeholder="Enter route name"
                    value={stopForm.routeName}
                    onChange={(e) =>
                      setStopForm({
                        ...stopForm,
                        routeName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Latitude</label>

                  <input
                    type="number"
                    step="any"
                    placeholder="Enter latitude"
                    value={stopForm.latitude}
                    onChange={(e) =>
                      setStopForm({
                        ...stopForm,
                        latitude: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Longitude</label>

                  <input
                    type="number"
                    step="any"
                    placeholder="Enter longitude"
                    value={stopForm.longitude}
                    onChange={(e) =>
                      setStopForm({
                        ...stopForm,
                        longitude: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Stop Order</label>

                  <input
                    type="number"
                    placeholder="Enter stop order"
                    value={stopForm.stopOrder}
                    onChange={(e) =>
                      setStopForm({
                        ...stopForm,
                        stopOrder: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-button"
                  >
                    Save Stop
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* ================= BUS TABLE ================= */}

          {activeTab === "buses" && (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Bus Number</th>
                    <th>Registration</th>
                    <th>Driver</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {buses.map((bus) => (
                    <tr key={bus._id}>

                      <td>{bus.busNumber}</td>

                      <td>{bus.registrationNumber}</td>

                      <td>{bus.driverName}</td>

                      <td>{bus.routeName}</td>

                      <td>
                        <span
                          className={`status ${
                            bus.status === "Inactive"
                              ? "inactive"
                              : ""
                          }`}
                        >
                          {bus.status}
                        </span>
                      </td>

                      <td>

                        <div className="actions">

                          <button
                            className="edit"
                            onClick={() =>
                              editBus(
                                bus._id,
                                bus
                              )
                            }
                            title="Edit Bus"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              deleteItem(
                                "bus",
                                bus._id
                              )
                            }
                            title="Delete Bus"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

              {buses.length === 0 && (
                <div className="empty">
                  No buses found.
                </div>
              )}

            </div>
          )}

          {/* ================= ROUTE TABLE ================= */}

          {activeTab === "routes" && (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Route Name</th>
                    <th>Start Point</th>
                    <th>End Point</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {routes.map((route) => (
                    <tr key={route._id}>

                      <td>{route.routeName}</td>

                      <td>{route.startPoint}</td>

                      <td>
                        {route.destination ||
                          route.endPoint ||
                          "-"}
                      </td>

                      <td>
                        <span
                          className={`status ${
                            route.status === "Inactive"
                              ? "inactive"
                              : ""
                          }`}
                        >
                          {route.status || "Active"}
                        </span>
                      </td>

                      <td>

                        <div className="actions">

                          <button
                            className="edit"
                            onClick={() =>
                              editRoute(
                                route._id,
                                route
                              )
                            }
                            title="Edit Route"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              deleteItem(
                                "route",
                                route._id
                              )
                            }
                            title="Delete Route"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

              {routes.length === 0 && (
                <div className="empty">
                  No routes found.
                </div>
              )}

            </div>
          )}

          {/* ================= STOP TABLE ================= */}

          {activeTab === "stops" && (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Stop Name</th>
                    <th>Location</th>
                    <th>Route</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {stops.map((stop) => (
                    <tr key={stop._id}>

                      <td>{stop.stopName}</td>

                      <td>{stop.location}</td>

                      <td>{stop.routeName}</td>

                      <td>{stop.latitude}</td>

                      <td>{stop.longitude}</td>

                      <td>

                        <div className="actions">

                          <button
                            className="edit"
                            onClick={() =>
                              editStop(
                                stop._id,
                                stop
                              )
                            }
                            title="Edit Stop"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              deleteItem(
                                "stop",
                                stop._id
                              )
                            }
                            title="Delete Stop"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

              {stops.length === 0 && (
                <div className="empty">
                  No stops found.
                </div>
              )}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}
function StudentPage() {
  return (
    <div className="app">

      <button
        onClick={() => {
          window.location.href = "/admin";
        }}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 9999,
          padding: "10px 18px",
          background: "#1e3a8a",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        ← Back to Admin
      </button>

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

  {/* Home → Live Tracking */}
  <Route path="/" element={<StudentPage />} />

  {/* Admin Dashboard */}
  <Route path="/admin" element={<AdminDashboard />} />

  {/* Driver */}
  <Route path="/driver" element={<Driver />} />

  {/* Live Tracking */}
  <Route path="/live-tracking" element={<StudentPage />} />

</Routes>
    </BrowserRouter>
  );
}

export default App;