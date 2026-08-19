/* =========================================================
   COLLEGE BUS LIVE - DRIVER SCRIPT
   Socket.IO + Trip + Live Location
   ========================================================= */

let socket = null;

const BUS_ID = "BUS 01";

/* =========================
   LOAD SOCKET.IO CLIENT
   ========================= */

const socketScript = document.createElement("script");

socketScript.src = "http://localhost:5000/socket.io/socket.io.js";

socketScript.onload = () => {
    console.log("Socket.IO client loaded");

    socket = io("http://localhost:5000");

    socket.on("connect", () => {
        console.log("Driver connected to Socket.IO");

        socket.emit("join-bus", BUS_ID);

        console.log("Driver joined bus room:", BUS_ID);
    });

    socket.on("connect_error", (error) => {
        console.error(
            "Socket.IO connection error:",
            error.message
        );
    });

    socket.on("disconnect", () => {
        console.log("Driver disconnected from Socket.IO");
    });
};

socketScript.onerror = () => {
    console.error("Could not load Socket.IO client.");
};

document.head.appendChild(socketScript);


/* =========================
   TRIP VARIABLES
   ========================= */

let tripActive = false;
let locationIndex = 0;


/* =========================
   BUS ROUTE
   ========================= */

const busLocations = [
    "SVCE College",
    "Karakambadi",
    "Renigunta Road",
    "Alipiri",
    "Tirupati"
];


/* =========================
   GPS COORDINATES
   ========================= */

const busCoordinates = [
    {
        latitude: 13.6288,
        longitude: 79.4192
    },
    {
        latitude: 13.6350,
        longitude: 79.4420
    },
    {
        latitude: 13.6305,
        longitude: 79.5120
    },
    {
        latitude: 13.6288,
        longitude: 79.4190
    },
    {
        latitude: 13.6288,
        longitude: 79.4192
    }
];


/* =========================
   START TRIP
   ========================= */

function startTrip() {

    tripActive = true;
    locationIndex = 0;

    document.getElementById("driverStatus").textContent =
        "Active";

    document.getElementById("tripStatus").textContent =
        "Trip Started";

    document.getElementById("location").textContent =
        busLocations[locationIndex];

    document.getElementById("studentStatus").textContent =
        "Bus is Live";

    document.getElementById("studentLocation").textContent =
        busLocations[locationIndex];

    document.getElementById("nextStop").textContent =
        busLocations[locationIndex + 1];

    document.getElementById("arrival").textContent =
        "On the way";

    document.getElementById("startBtn").disabled = true;

    document.getElementById("endBtn").disabled = false;


    /* Send trip start to backend */

    if (socket && socket.connected) {

        socket.emit("trip-start", {

            busId: BUS_ID,

            location:
                busLocations[locationIndex],

            latitude:
                busCoordinates[locationIndex].latitude,

            longitude:
                busCoordinates[locationIndex].longitude
        });

        console.log("Trip start sent to backend");
    }


    /* Send first location */

    sendLocation();
}


/* =========================
   UPDATE BUS LOCATION
   ========================= */

function updateLocation() {

    if (!tripActive) {
        return;
    }

    locationIndex++;


    /* Destination reached */

    if (locationIndex >= busLocations.length) {

        locationIndex = busLocations.length - 1;

        document.getElementById("tripStatus").textContent =
            "Route Completed";

        document.getElementById("studentStatus").textContent =
            "Route Completed";

        document.getElementById("nextStop").textContent =
            "Destination Reached";

        document.getElementById("arrival").textContent =
            "Arrived";

        sendLocation();

        return;
    }


    /* Current location */

    document.getElementById("location").textContent =
        busLocations[locationIndex];

    document.getElementById("studentLocation").textContent =
        busLocations[locationIndex];


    /* Next stop */

    if (locationIndex < busLocations.length - 1) {

        document.getElementById("nextStop").textContent =
            busLocations[locationIndex + 1];

        document.getElementById("arrival").textContent =
            "In progress";
    }


    /* Send location */

    sendLocation();
}


/* =========================
   SEND LOCATION TO BACKEND
   ========================= */

function sendLocation() {

    if (!socket || !socket.connected) {

        console.log(
            "Socket not connected - location not sent"
        );

        return;
    }

    const currentLocation =
        busCoordinates[locationIndex];

    const locationData = {

        busId: BUS_ID,

        location:
            busLocations[locationIndex],

        latitude:
            currentLocation.latitude,

        longitude:
            currentLocation.longitude
    };

    socket.emit(
        "driver-location",
        locationData
    );

    console.log(
        "Live location sent:",
        locationData
    );
}


/* =========================
   END TRIP
   ========================= */

function endTrip() {

    tripActive = false;

    document.getElementById("driverStatus").textContent =
        "Offline";

    document.getElementById("tripStatus").textContent =
        "Trip Ended";

    document.getElementById("studentStatus").textContent =
        "Bus is Offline";

    document.getElementById("nextStop").textContent =
        "Trip Ended";

    document.getElementById("arrival").textContent =
        "Not Available";

    document.getElementById("startBtn").disabled = false;

    document.getElementById("endBtn").disabled = true;


    /* Send trip stop to backend */

    if (socket && socket.connected) {

        socket.emit("trip-stop", {

            busId: BUS_ID,

            location:
                busLocations[locationIndex],

            latitude:
                busCoordinates[locationIndex].latitude,

            longitude:
                busCoordinates[locationIndex].longitude
        });

        console.log("Trip stop sent to backend");
    }
}


/* =========================
   AUTOMATIC BUS MOVEMENT
   ========================= */

/*
   Move the bus automatically
   every 5 seconds.
*/

setInterval(updateLocation, 5000);