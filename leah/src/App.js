import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import locationsData from './locations.json'; 

const MapLibreArcGISMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); 
  const [locations, setLocations] = useState([]); 

  useEffect(() => {
    setLocations(locationsData);

    if (mapContainer.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'arcgis-tiles': {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'arcgis-tiles-layer',
              type: 'raster',
              source: 'arcgis-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [-73.941865, 45.405430], // Centered on John Abbott College for demo
        zoom: 14,
      });

      locations.forEach((location) => {
        const marker = new maplibregl.Marker()
          .setLngLat(location.coordinates)
          .setPopup(new maplibregl.Popup().setText(location.name))
          .addTo(mapRef.current);
        console.log("Added marker for:", location.name);
      });
    }

    return () => mapRef.current && mapRef.current.remove();
  }, [locations]); 

  return <div className="map-container" ref={mapContainer} />;
};

export default MapLibreArcGISMap;
