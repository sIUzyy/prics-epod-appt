// ---- react ----
import { useState, useEffect } from "react";

// ---- component ----
import PriorityListTable from "@/components/admin-components/admin-priority-table";
import LoadingTable from "@/components/loading/loading-table";
import Heading from "@/components/header/page-heading";

// ---- library ----
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // ---- axios

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export default function AdminPriorityPage() {
  // ---- state to stored the truck data
  const [truckData, setTruckData] = useState([]);

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);

  // ---- function to fetch all truck data
  useEffect(() => {
    const fetchTruckData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/truck`);
        const data = response.data.truck;

        setTruckData(data);
      } catch (error) {
        console.error("Failed to fetch truck:", error);

        toast.error(
          "We could not load your truck list data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTruckData();
  }, []);

  return (
    <div className="my-5 mx-4 w-[100vh]">
      <Heading
        title={"Order Priority"}
        description={`Check the list of tracking numbers for your trucks scheduled for delivery and set a priority order.`}
      />
      {isLoading ? <LoadingTable /> : <PriorityListTable data={truckData} />}
    </div>
  );
}
