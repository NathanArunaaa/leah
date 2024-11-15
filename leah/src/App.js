import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import locationsData from "./locations.json";

const MapLibreArcGISMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  useEffect(() => {
    setLocations(locationsData);

    if (mapContainer.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            "arcgis-tiles": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "arcgis-tiles-layer",
              type: "raster",
              source: "arcgis-tiles",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        center: [-73.941865, 45.40543],
        zoom: 14,
      });

      locations.forEach((location) => {
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.backgroundImage =
          "url(https://cdn-icons-png.flaticon.com/512/2636/2636439.png)";
        el.style.width = "30px";
        el.style.height = "30px";
        el.style.backgroundSize = "cover";

        const marker = new maplibregl.Marker({
          element: el,
          color: null,
        })
          .setLngLat(location.coordinates)
          .setPopup(new maplibregl.Popup().setText(location.name))
          .addTo(mapRef.current);

        marker.getElement().addEventListener("mouseenter", () => {
          setHoveredLocation(location);
        });
        marker.getElement().addEventListener("mouseleave", () => {
          setHoveredLocation(null);
        });
      });
    }

    return () => mapRef.current && mapRef.current.remove();
  }, [locations]);

  return (
    <div className="relative w-full h-screen" ref={mapContainer}>
      {hoveredLocation && (
        <div className="absolute top-4 left-4 bg-blue-50 dark:bg-gray-800 text-blue-800 dark:text-blue-400 p-4 rounded-lg shadow-lg z-10">
          <div className="flex items-start text-sm">
            <svg
              className="flex-shrink-0 w-4 h-4 mr-3 mt-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
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
    </div>
  );
};

export default MapLibreArcGISMap;
