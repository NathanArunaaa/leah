import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import locationsData from "./locations.json";
import "leaflet/dist/leaflet.css";
import recyclingBinIcon from "./assets/recycling-bin.png";
import LinkPreview from "./LinkPreview";

const LeahMap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isTipsModalVisible, setIsTipsModalVisible] = useState(false);
  const [isFinderModalVisible, setIsFinderModalVisible] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [newBinLocation, setNewBinLocation] = useState(null); // State to store new bin location

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
        zoom: 16,
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

        marker.on("mouseover", () => setHoveredLocation(location));
        marker.on("mouseout", () => setHoveredLocation(null));
      });

      if (newBinLocation) {
        const { lat, lng } = newBinLocation;
        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapRef.current)
          .bindPopup("New Recycling Bin");

        marker.on("mouseover", () =>
          setHoveredLocation({
            name: "New Recycling Bin",
            coordinates: [lat, lng],
          })
        );
        marker.on("mouseout", () => setHoveredLocation(null));
      }
    }
  }, [newBinLocation]);

  const openModal = (modalType) => {
    setIsTipsModalVisible(false);
    setIsFinderModalVisible(false);
    setIsAboutModalVisible(false);

    if (modalType === "tips") setIsTipsModalVisible(true);
    if (modalType === "finder") setIsFinderModalVisible(true);
    if (modalType === "about") setIsAboutModalVisible(true);
  };

  // Function to handle adding a new bin
  const handleAddBin = () => {
    const lat = parseFloat(prompt("Enter latitude for new bin:"));
    const lng = parseFloat(prompt("Enter longitude for new bin:"));

    if (!isNaN(lat) && !isNaN(lng)) {
      setNewBinLocation({ lat, lng });
    } else {
      alert("Invalid coordinates");
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full"></div>

      {hoveredLocation && (
        <div
          className="absolute top-4 left-4 bg-blue-50 dark:bg-blue-50 text-blue-800 dark:text-blue-800 p-4 rounded-lg shadow-lg z-50"
          style={{ zIndex: 2000 }}
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
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${
          isTipsModalVisible ? "block" : "hidden"
        }`}
        style={{ zIndex: 2000 }}
      >
        <div className="bg-blue-50 rounded-lg shadow-lg p-6 max-h-[70vh] w-[90%] md:w-[60%] overflow-y-auto relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">
              Environmental Tips♻️
            </h2>
            <button
              onClick={() => setIsTipsModalVisible(false)}
              className="text-blue-800 hover:text-blue-500 font-bold text-lg"
            >
              X
            </button>
          </div>

          <div className="flex flex-col justify-start overflow-hidden space-y-4 py-4 max-h-[80vh]">
            <LinkPreview url="https://www.nature.org/en-us/about-us/where-we-work/united-states/delaware/stories-in-delaware/delaware-eight-ways-to-reduce-waste/" />
            <LinkPreview url="https://mighty.market/collections/reusable?srsltid=AfmBOoqBn0MIwE5cHD-anBpjyK-p2DmMyS1SAXNXL50_T73E8OE6mY9_" />
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${
          isFinderModalVisible ? "block" : "hidden"
        }`}
        style={{ zIndex: 2000 }}
      >
        <div className="bg-blue-50 rounded-lg shadow-lg p-6 ">
          <h2 className="text-xl font-bold mb-4 text-blue-800">Bin Finder🗑️</h2>
          <p className="text-gray-700">
            Locate nearest bin content will go here
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsFinderModalVisible(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${
          isAboutModalVisible ? "block" : "hidden"
        }`}
        style={{ zIndex: 2000 }}
      >
        <div className="bg-blue-50 rounded-lg shadow-lg p-6 max-w-2xl w-full md:w-[60%]">
          <h2 className="text-xl font-bold mb-4 text-blue-800">About Us</h2>
          <p className="text-gray-700">
            We're a group of four John Abbott students and our mission is to
            empower communities to take action against waste by making recycling
            simple, accessible, and impactful. Together, we can create a
            cleaner, greener, and more sustainable future for all.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsAboutModalVisible(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-2000" style={{ zIndex: 2000 }}>
        <button
          onClick={handleAddBin}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
          style={{ zIndex: 2000 }}
        >
          Add Location
        </button>
      </div>

      <div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-blue-50 text-white rounded-lg shadow-lg p-2"
        style={{ zIndex: 2000 }}
      >
        <div className="flex justify-around">
          <button
            onClick={() => openModal("tips")}
            className="px-4 py-2 text-blue-800 font-bold text-md"
          >
            Tips
          </button>
          <button className="px-4 py-2 text-blue-800 font-bold text-md">
            -
          </button>
          <button
            onClick={() => openModal("about")}
            className="px-4 py-2 text-blue-800 font-bold text-md"
          >
            About
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeahMap;
