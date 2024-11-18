import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import locationsData from "./locations.json";
import "leaflet/dist/leaflet.css";
import recyclingBinIcon from "./assets/recycling-bin.png";

const StadiaMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const customIcon = L.icon({
    iconUrl: recyclingBinIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = L.map(mapContainer.current, {
        center: [45.40543, -73.941865],
        zoom: 17,
        zoomControl: false,
        layers: [
          L.tileLayer(
            "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
            {
              minZoom: 0,
              maxZoom: 20,
              attribution: "",
              ext: "png",
            }
          ),
        ],
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      locationsData.forEach((location) => {
        const marker = L.marker([...location.coordinates].reverse(), {
          icon: customIcon,
        })
          .addTo(mapRef.current)
          .bindPopup(location.name);

        marker.on("mouseover", () => {
          console.log("Hovered Location:", location);
          setHoveredLocation(location);
        });
        marker.on("mouseout", () => setHoveredLocation(null));
      });
    }
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full"></div>

      {hoveredLocation && (
        <div
          className="absolute top-4 left-4 bg-blue-50 dark:bg-gray-800 text-blue-800 dark:text-blue-400 p-4 rounded-lg shadow-lg z-50"
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-start text-sm">
            <img
              className="flex-shrink-0 w-6 h-6 mr-3"
              src={recyclingBinIcon}
              alt="Recycling Bin"
            />
            <div>
              <span className="font-medium">{hoveredLocation.name}</span>
              <ul className="mt-1.5 list-disc list-inside space-y-1">
                <li>Coordinates: {hoveredLocation.coordinates.join(", ")}</li>
                <li>More details about {hoveredLocation.name}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-blue-50 text-white rounded-lg shadow-lg p-2 w-full sm:w-auto"
        style={{ zIndex: 2000 }}
      >
        <div className="flex justify-around">
          <button className="px-4 py-2 text-blue-800 font-medium">Environmental Tips</button>
          <button className="px-4 py-2 text-blue-800 font-medium">Nearest Bin</button>
          <button className="px-4 py-2 text-blue-800 font-medium">About</button>
        </div>
      </div>
    </div>
  );
};

export default StadiaMap;
