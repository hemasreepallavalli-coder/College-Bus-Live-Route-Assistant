let tripActive = false;

let locationIndex = 0;


/* Bus Route */

const busLocations = [
    "SVCE College",
    "Karakambadi",
    "Renigunta Road",
    "Alipiri",
    "Tirupati"
];


/* Start Trip */

function startTrip() {

    tripActive = true;

    locationIndex = 0;

    // Driver dashboard
    document.getElementById("driverStatus").textContent = "Active";

    document.getElementById("tripStatus").textContent = "Trip Started";

    document.getElementById("location").textContent =
        busLocations[locationIndex];


    // Student view
    document.getElementById("studentStatus").textContent =
        "Bus is Live";

    document.getElementById("studentLocation").textContent =
        busLocations[locationIndex];

    document.getElementById("nextStop").textContent =
        busLocations[locationIndex + 1];

    document.getElementById("arrival").textContent =
        "On the way";


    // Buttons
    document.getElementById("startBtn").disabled = true;

    document.getElementById("endBtn").disabled = false;

}


/* Move Bus */

function updateLocation() {

    if (!tripActive) {
        return;
    }

    locationIndex++;


    // Destination reached
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

        return;
    }


    // Current location
    document.getElementById("location").textContent =
        busLocations[locationIndex];

    document.getElementById("studentLocation").textContent =
        busLocations[locationIndex];


    // Next stop
    if (locationIndex < busLocations.length - 1) {

        document.getElementById("nextStop").textContent =
            busLocations[locationIndex + 1];

        document.getElementById("arrival").textContent =
            "In progress";

    }

}


/* End Trip */

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

}


/*
   Move the bus automatically
   every 5 seconds
*/

setInterval(updateLocation, 5000);