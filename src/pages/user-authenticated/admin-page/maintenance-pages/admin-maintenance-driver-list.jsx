// component
import Heading from "@/components/header/page-heading";
import DriverListTable from "@/components/admin-components/admin-maintenance-table/driver-list-table";
import LoadingTable from "@/components/loading/loading-table";

// react
import { useEffect, useState } from "react";

// toast
import { toast } from "sonner";

// axios
import axios from "axios";

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export default function AdminMaintenanceDriverList() {
  // state to stored the driver data
  const [driverData, setDriverData] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // fetch all truck data
  useEffect(() => {
    const fetchDriverData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/driver`);
        const data = response.data.driver;

        setDriverData(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch truck:", error);

        toast.error(
          "We could not load your driver list data. Please try again later.",
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

    fetchDriverData();
  }, []);

  return (
    <div className="my-5 mx-4 w-[100vh]">
      <div>
        <Heading
          title={"Driver List"}
          description={`View all your drivers and their details.`}
        />

        {isLoading ? <LoadingTable /> : <DriverListTable data={driverData} />}
      </div>
    </div>
  );
}
