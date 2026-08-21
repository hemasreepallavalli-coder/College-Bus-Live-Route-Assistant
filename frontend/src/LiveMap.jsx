 import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./LiveMap.css";

const socket = io("https://college-bus-live-route-assistant-updated.onrender.com", {
  transports: ["websocket", "polling"],
});

const busIcon = L.divIcon({
  className: "bus-marker",
  html: "🚌",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const routeStops = [
  {
    name: "SVCE College",
    latitude: 13.6288,
    longitude: 79.4192,
    label: "Starting Point",
  },
  {
    name: "Karakambadi",
    latitude: 13.63,
    longitude: 79.4175,
    label: "Next Stop",
  },
  {
    name: "Renigunta Road",
    latitude: 13.632,
    longitude: 79.4145,
    label: "Upcoming",
  },
  {
    name: "Alipiri",
    latitude: 13.634,
    longitude: 79.411,
    label: "Upcoming",
  },
  {
    name: "Tirupati",
    latitude: 13.6355,
    longitude: 79.4055,
    label: "Destination",
  },
];

const routeLine = routeStops.map((stop) => [
  stop.latitude,
  stop.longitude,
]);

function getClosestStop(latitude, longitude) {
  let closestIndex = 0;
  let minimumDistance = Infinity;

  routeStops.forEach((stop, index) => {
    const distance =
      Math.abs(stop.latitude - latitude) +
      Math.abs(stop.longitude - longitude);

    if (distance < minimumDistance) {
      minimumDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

async function getRealEta(
  fromLat,
  fromLng,
  toLat,
  toLng
) {
  try {
const url =
  `https://college-bus-live-route-assistant-updated.onrender.com/api/eta` +
  `?fromLat=${fromLat}` +
  `&fromLng=${fromLng}` +
  `&toLat=${toLat}` +
  `&toLng=${toLng}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("ETA request failed");
    }

    const data = await response.json();

    return {
      distanceKm: data.distanceKm,
      durationMinutes: data.durationMinutes,
    };
  } catch (error) {
    console.error("ETA error:", error);
    return null;
  }
}

function LiveMap() {
  const [busLocation, setBusLocation] = useState({
    latitude: routeStops[0].latitude,
    longitude: routeStops[0].longitude,
  });

  const [connected, setConnected] = useState(false);
  const [currentStop, setCurrentStop] = useState(0);
  const [nextStop, setNextStop] = useState("Karakambadi");
  const [eta, setEta] = useState("Calculating...");
  const [distance, setDistance] = useState("--");

  useEffect(() => {
    setConnected(socket.connected);

    const handleConnect = () => {
      console.log("LiveMap connected to server");
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log("LiveMap disconnected from server");
      setConnected(false);
    };

    const handleBusLocation = async (location) => {
      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      setBusLocation({
        latitude,
        longitude,
      });

      const stopIndex = getClosestStop(
        latitude,
        longitude
      );

      setCurrentStop(stopIndex);

      if (stopIndex < routeStops.length - 1) {
        const next = routeStops[stopIndex + 1];

        setNextStop(next.name);

        const result = await getRealEta(
          latitude,
          longitude,
          next.latitude,
          next.longitude
        );

        if (result) {
          setDistance(`${result.distanceKm} km`);
          setEta(`${result.durationMinutes} min`);
        } else {
          setDistance("--");
          setEta("Calculating...");
        }
      } else {
        setNextStop("Destination Reached");
        setDistance("0 km");
        setEta("Arrived");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("bus-location", handleBusLocation);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("bus-location", handleBusLocation);
    };
  }, []);

  const position = [
    busLocation.latitude,
    busLocation.longitude,
  ];

  const currentLocation =
    routeStops[currentStop]?.name || "Unknown";

  return (
    <div className="live-map-page">

      {/* HEADER */}
      <div className="map-header">

        <div>
          <p className="map-label">
            LIVE BUS TRACKING
          </p>

          <h1>
            College Bus Live Map
          </h1>

          <p>
            Track Bus 01 in real time
          </p>
        </div>

        <div
          className={
            connected
              ? "server-online"
              : "server-offline"
          }
        >
          <span></span>

          {connected
            ? "Live Connected"
            : "Server Offline"}
        </div>

      </div>

      {/* MAP */}
      <div className="map-card">

        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className="live-map"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* BLUE ROUTE LINE */}
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: "#2563eb",
              weight: 6,
              opacity: 0.9,
            }}
          />

          {/* BUS MARKER */}
          <Marker
            position={position}
            icon={busIcon}
          >
            <Popup>

              <strong>
                🚌 Bus 01
              </strong>

              <br />

              Current:
              {" "}
              {currentLocation}

              <br />

              Next:
              {" "}
              {nextStop}

              <br />

              ETA:
              {" "}
              {eta}

              <br />

              Distance:
              {" "}
              {distance}

            </Popup>

          </Marker>

        </MapContainer>

      </div>

      {/* LIVE INFORMATION */}
      <div className="location-info">

        <div>
          <span>BUS</span>
          <strong>01</strong>
        </div>

        <div>
          <span>CURRENT LOCATION</span>
          <strong>
            {currentLocation}
          </strong>
        </div>

        <div>
          <span>NEXT STOP</span>
          <strong>
            {nextStop}
          </strong>
        </div>

        <div>
          <span>ETA</span>
          <strong>
            {eta}
          </strong>
        </div>

        <div>
          <span>DISTANCE</span>
          <strong>
            {distance}
          </strong>
        </div>

      </div>

      {/* ROUTE PROGRESS */}
      <div className="route-progress-card">

        <div className="route-progress-header">

          <div>

            <p className="map-label">
              ROUTE PROGRESS
            </p>

            <h2>
              SVCE College → Tirupati
            </h2>

          </div>

          <div className="progress-count">

            {currentStop + 1}
            {" / "}
            {routeStops.length}

          </div>

        </div>

        <div className="progress-line">

          {routeStops.map((stop, index) => {

            let stopClass =
              "route-stop-item";

            if (index < currentStop) {
              stopClass += " completed";
            } else if (index === currentStop) {
              stopClass += " current";
            } else {
              stopClass += " upcoming";
            }

            return (
              <div
                className={stopClass}
                key={stop.name}
              >

                <div className="route-node">

                  {index < currentStop
                    ? "✓"
                    : index + 1}

                </div>

                <div className="route-stop-content">

                  <strong>
                    {stop.name}
                  </strong>

                  <small>

                    {index === currentStop
                      ? "Current Location"
                      : index < currentStop
                      ? "Completed"
                      : stop.label}

                  </small>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default LiveMap;