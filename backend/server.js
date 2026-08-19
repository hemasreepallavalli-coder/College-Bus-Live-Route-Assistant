const dns = require("dns");

// Use reliable DNS servers for MongoDB SRV connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const stopRoutes = require("./routes/stopRoutes");

require("dotenv").config();

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: [
     
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// =========================
// HTTP SERVER
// =========================

const server = http.createServer(app);

// =========================
// SOCKET.IO
// =========================

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],
    methods: ["GET", "POST"],
  },
});

// Make Socket.IO available inside routes
app.set("io", io);

// =========================
// SOCKET CONNECTION
// =========================

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Driver joins a bus room
  socket.on("join-bus", (busId) => {
    if (!busId) return;

    socket.join(`bus-${busId}`);

    console.log(
      `Socket ${socket.id} joined bus-${busId}`
    );
  });

  // Driver sends live GPS location
  socket.on("driver-location", (data) => {
    console.log("Driver location received:", data);

    /*
      Expected data:

      {
        busId: "...",
        latitude: 17.3850,
        longitude: 78.4867
      }
    */

    if (!data || !data.busId) return;

    // Send location to users watching this bus
    io.to(`bus-${data.busId}`).emit(
      "bus-location-update",
      data
    );
  });
// Sahithi Live Tracking
socket.on("bus-location", (data) => {
  console.log("Sahithi location received:", data);

  if (!data) return;

  const locationData = {
    ...data,
    busId: data.busId || "BUS 01",
  };

  io.emit("bus-location", locationData);

  io.to(`bus-${locationData.busId}`).emit(
    "bus-location-update",
    locationData
  );
});

  // Driver starts a trip
  socket.on("trip-start", (data) => {
    console.log("Trip started:", data);

    if (!data || !data.busId) return;

    io.to(`bus-${data.busId}`).emit(
      "trip-started",
      data
    );
  });

  // Driver stops/ends a trip
  socket.on("trip-stop", (data) => {
    console.log("Trip stopped:", data);

    if (!data || !data.busId) return;

    io.to(`bus-${data.busId}`).emit(
      "trip-stopped",
      data
    );
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// =========================
// API ROUTES
// =========================

app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/stops", stopRoutes);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "College Bus Admin Backend is running!",
    socket: "Socket.IO enabled",
  });
});

// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );

      console.log(
        "Socket.IO server is running successfully"
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });