import axios from "axios";

// ---- open cage api .env ----
const API_KEY = import.meta.env.VITE_OPENCAGE_API;

// convert the warehouse address and customer address to lat & long.
export const fetchCoordinates = async (address) => {
  const cachedCoords = localStorage.getItem(address);

  if (cachedCoords) {
    return JSON.parse(cachedCoords);
  }

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      const coords = { lat, lng };
      localStorage.setItem(address, JSON.stringify(coords));
      return coords;
    }
    return null;
  } catch (error) {
    console.error("Opencage geocoding failed. Please try again later:", error);

    return null; // Return null when the API call fails
  }
};
