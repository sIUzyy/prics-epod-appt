// timezone api-key
const TIMEDB_APIKEY = import.meta.env.VITE_TIMEZONEDB_API;

export const fetchTime = async () => {
  try {
    const response = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEDB_APIKEY}&format=json&by=zone&zone=Asia/Manila`
    );
    const data = await response.json();
    return data.formatted;
  } catch (error) {
    console.error("Error fetching time:", error);
    return null;
  }
};
