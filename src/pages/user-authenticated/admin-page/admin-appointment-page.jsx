// ---- react ----
import { useState, useEffect, useMemo } from "react";

// ---- components ----
import AppointmentModal from "@/components/modal/appointment-modal";
import LoadingCard from "@/components/loading/loading-card";
import Heading from "@/components/header/page-heading";

// ---- shadcn component ----
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- library ----
import { CalendarCheck2, Truck, CalendarPlus } from "lucide-react"; // ---- icons
import { NavLink, Outlet } from "react-router"; // ---- react router
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // ---- axios
import dayjs from "dayjs"; // ---- dayjs

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export default function AdminAppointmentPage() {
  // state to stored the appointment data
  const [appointmentData, setAppointmentData] = useState([]);

  // state to stored the truck data
  const [truckData, setTruckData] = useState([]);

  // loading state
  const [isTruckLoading, setIsTruckLoading] = useState(false);
  const [isAppointmentLoading, setIsAppointmentLoading] = useState(false);

  // combine loading state
  const isLoading = isTruckLoading || isAppointmentLoading;

  // ---- fn to fetch all the appointments
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setIsAppointmentLoading(true);
      try {
        const response = await axios.get(`${API_ENDPOINT}/api/appointment`);
        const data = response.data.appointments;
        setAppointmentData(data);
      } catch (error) {
        console.error("Failed to fetch appointment", error);
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
        setIsAppointmentLoading(false);
      }
    };

    fetchAppointmentData();
  }, []);

  // ---- get today's date in Philippine Time (PHT) using Intl.DateTimeFormat
  const todayPHT = useMemo(() => {
    return dayjs().tz("Asia/Manila").startOf("day");
  }, []);

  // ---- get the length of today appointment
  const todayAppointmentsCount = useMemo(() => {
    return appointmentData.filter((appointment) => {
      const appointmentDate = dayjs(appointment.appointment_date)
        .tz("Asia/Manila")
        .startOf("day");
      return appointmentDate.isSame(todayPHT, "day");
    }).length;
  }, [appointmentData, todayPHT]);

  // fetch all truck data
  useEffect(() => {
    const fetchTruckData = async () => {
      setIsTruckLoading(true);

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
        setIsTruckLoading(false);
      }
    };

    fetchTruckData();
  }, []);

  // state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true); // open the modal
  };

  return (
    <>
      {isModalOpen && (
        <AppointmentModal open={isModalOpen} setOpen={setIsModalOpen} />
      )}
      <div className="my-5 mx-4">
        <Heading
          title="Appointment"
          description="Below is an overview of your appointments."
        />

        {isLoading ? (
          <LoadingCard />
        ) : (
          <div className="card_section flex gap-x-3">
            <Card className={"max-w-[320px]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Today’s Appointment
                  </CardTitle>
                  <CalendarCheck2 size={25} />
                </div>
              </CardHeader>

              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {todayAppointmentsCount ? todayAppointmentsCount : 0}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Total Number of Appointments Scheduled for Today
                </p>
              </CardContent>
            </Card>
            <Card className={"max-w-[320px]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Total Appointment
                  </CardTitle>
                  <CalendarCheck2 size={25} />
                </div>
              </CardHeader>
              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {appointmentData ? appointmentData.length : "N/A"}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Total number of appointments recorded in the system.
                </p>
              </CardContent>
            </Card>

            <Card className={"max-w-[320px]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Total Trucks
                  </CardTitle>
                  <Truck size={25} />
                </div>
              </CardHeader>
              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {truckData ? truckData.length : 0}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Total number of trucks you own and have available for your
                  operations or transport needs.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="outlet_todays_all_appointment my-5  ">
          <div className="outlet_navigation flex gap-x-5">
            <div className="create_appointment">
              <button onClick={handleOpenModal} title="create an appointment ">
                <CalendarPlus className="cursor-pointer" />
              </button>
            </div>

            <NavLink
              to={"/admin/appointments/today-appointments"}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 font-bold underline decoration-2 underline-offset-5 uppercase"
                  : "text-[#979090] font-bold hover:text-blue-500 uppercase"
              }
            >
              Today’s Appointment
            </NavLink>
            <NavLink
              to={"/admin/appointments/all-appointments"}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 font-bold underline decoration-2 underline-offset-5 uppercase"
                  : "text-[#979090] font-bold hover:text-blue-500 uppercase"
              }
            >
              All Appointment
            </NavLink>
          </div>

          <div className="outlet_table my-5">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
