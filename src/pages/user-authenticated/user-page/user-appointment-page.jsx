// ---- components ----
import Heading from "@/components/header/page-heading";
import UserAppointment from "@/components/user-components/user-appointment";

// ---- context ----
import { useAuth } from "@/context/AuthContextProvider";

// ---- axios
import axios from "axios";

// ---- react ----
import { useEffect, useState } from "react";

// ---- toast ----
import { toast } from "sonner";

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export default function UserAppointmentPage() {
  // context
  const { user } = useAuth();

  // stored the appointment list
  const [appointmentData, setAppointmentData] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // fetch appointment list by plate no
  useEffect(() => {
    const getAppointmentListByPlateNo = async () => {
      setIsLoading(true);

      try {
        const plate_no = user.plateNo;
        const response = await axios.get(
          `${API_ENDPOINT}/api/appointment/${plate_no}`
        );
        setAppointmentData(response.data.appointments);
      } catch (error) {
        console.log(error);
        toast.error(
          "We could not retrieve your appointment data. Please try again later.",
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
    getAppointmentListByPlateNo();
  }, [user.plateNo]);

  return (
    <div className="my-5 mx-4">
      <Heading
        title={"my appointment"}
        description={`Below is an overview of all your scheduled appointments`}
      />

      {isLoading ? (
        <p className="text-gray-500 font-medium">Loading...</p>
      ) : (
        <UserAppointment data={appointmentData} />
      )}
    </div>
  );
}
