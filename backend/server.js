 const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let latestBusLocation = null;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  if (latestBusLocation) {
    socket.emit("bus-location", latestBusLocation);
  }

  socket.on("bus-location", (location) => {
    latestBusLocation = location;

    console.log("Bus location received:", location);

    io.emit("bus-location", location);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


/* Current bus location */
app.get("/", (req, res) => {
  res.json({
    status: "College Bus Live Tracking Server",
    busLocation: latestBusLocation,
  });
});


/* Road-based ETA */
app.get("/api/eta", async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({
        error: "Latitude and longitude are required",
      });
    }

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${fromLng},${fromLat};${toLng},${toLat}` +
      `?overview=false`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Routing service unavailable");
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({
        error: "Route not found",
      });
    }

    const route = data.routes[0];

    res.json({
      distanceKm: (route.distance / 1000).toFixed(2),
      durationMinutes: Math.ceil(route.duration / 60),
    });

  } catch (error) {
    console.error("ETA error:", error.message);

    res.status(500).json({
      error: "Unable to calculate ETA",
    });
  }
});


const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> origin/main
