const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

const route = [
  { latitude: 13.6288, longitude: 79.4192 },
  { latitude: 13.6300, longitude: 79.4175 },
  { latitude: 13.6320, longitude: 79.4145 },
  { latitude: 13.6340, longitude: 79.4110 },
  { latitude: 13.6355, longitude: 79.4055 }
];

let index = 0;

socket.on("connect", () => {
  console.log("Driver connected to server");

  setInterval(() => {
    const location = route[index];

    socket.emit("bus-location", location);

    console.log(
      `Bus location: ${location.latitude}, ${location.longitude}`
    );

    index = (index + 1) % route.length;
  }, 3000);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});