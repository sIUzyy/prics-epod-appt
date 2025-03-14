// icons
import { NotepadText, CalendarCheck2, User, Truck } from "lucide-react";

// shadcn component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// components
import Heading from "@/components/header/page-heading";
import LoadingTable from "@/components/loading/loading-table";
import LoadingCard from "@/components/loading/loading-card";
import AdminSummaryTable from "@/components/admin-components/admin-summary-table";

// axios
import axios from "axios";

// react
import { useState, useEffect, useMemo } from "react";

// toast
import { toast } from "sonner";

// ---- dayjs ----
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

// main dashboard of admin
export default function AdminOrderSummary() {
  // state to stored the shipment data
  const [shipmentsData, setShipmentsData] = useState([]);

  // state to stored the pre-delivery data
  const [preDeliveryData, setPreDeliveryData] = useState([]);

  // state to stored the truck data (to get the length)
  const [truckData, setTruckData] = useState([]);

  // state to stored the user guard role data (to get the length)
  const [userGuard, setUserGuard] = useState([]);

  // state to stored the appointment data
  const [appointmentData, setAppointmentData] = useState([]);

  // loading state
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [loadingPreDelivery, setLoadingPreDelivery] = useState(false);
  const [loadingTruckData, setLoadingTruckData] = useState(false);
  const [loadingUserGuard, setLoadingUserGuard] = useState(false);
  const [loadingAppointment, setLoadingAppointment] = useState(false);

  // conditional
  const isLoading =
    loadingShipments ||
    loadingPreDelivery ||
    loadingTruckData ||
    loadingUserGuard ||
    loadingAppointment;

  // fetch all the shipment data
  useEffect(() => {
    const fetchShipments = async () => {
      setLoadingShipments(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/shipment`);
        const data = response.data.shipments;

        const shipmentsWithCbm = data.map((shipment) => {
          let totalCbm = 0;

          shipment.productCodes.forEach((product) => {
            totalCbm += product.total_cbm_per_item;
          });

          return {
            ...shipment,
            totalCbm,
          };
        });

        setShipmentsData(shipmentsWithCbm);
      } catch (error) {
        console.error("Failed to fetch shipments:", error);
        toast.error(
          "We could not load your dashboard data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setLoadingShipments(false);
      }
    };

    fetchShipments();
  }, []);

  // fetch pre-delivery data for each shipment
  useEffect(() => {
    if (shipmentsData.length === 0) return;

    const fetchPreDeliveryData = async () => {
      setLoadingPreDelivery(true);

      try {
        const requests = shipmentsData.map((shipment) =>
          axios.get(`${API_ENDPOINT}/api/pre-delivery/${shipment.trackingNo}`)
        );

        const responses = await Promise.all(requests);
        const preDeliveryResults = responses.map((res) => res.data);

        setPreDeliveryData(preDeliveryResults);
      } catch (error) {
        console.error("Failed to fetch pre-delivery data:", error);
        toast.error(
          "We could not load your dashboard data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setLoadingPreDelivery(false);
      }
    };

    fetchPreDeliveryData();
  }, [shipmentsData]);

  // fetch truck length
  useEffect(() => {
    const fetchTruckList = async () => {
      setLoadingTruckData(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/truck`);
        setTruckData(response.data.truck);
      } catch (error) {
        console.error(error);
        toast.error(
          "We could not load your truck data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setLoadingTruckData(false);
      }
    };

    fetchTruckList();
  }, []);

  // fetch the user guard role length
  useEffect(() => {
    const fetchUserGuardRoleList = async () => {
      setLoadingUserGuard(true);

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/user`);
        setUserGuard(response.data.guards);
      } catch (error) {
        console.error(error);
        toast.error(
          "We could not load your user guard role data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      } finally {
        setLoadingUserGuard(false);
      }
    };

    fetchUserGuardRoleList();
  }, []);

  // fetch the appointment data
  useEffect(() => {
    const fetchAppointmentData = async () => {
      setLoadingAppointment(true);
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
        setLoadingAppointment(false);
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

  return (
    <div className="my-5 mx-4">
      <Heading
        title={"dashboard"}
        description={` Below is an overview of all orders, including transit, shipped, and
          completed transaction`}
      />

      {isLoading ? (
        <div>
          <LoadingCard />
          <LoadingTable />
        </div>
      ) : (
        <>
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
                  {" "}
                  {todayAppointmentsCount ? todayAppointmentsCount : 0}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Go to the Appointment menu to create and view the list of
                  appointments.
                </p>
              </CardContent>
            </Card>
            <Card className={"max-w-[320px]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Total Tracking No.
                  </CardTitle>
                  <NotepadText size={25} />
                </div>
              </CardHeader>
              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {shipmentsData.length > 0 ? shipmentsData.length : 0}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Use this tracking number to monitor the movement and status of
                  items within the warehouse.
                </p>
              </CardContent>
            </Card>

            <Card className={"max-w-[320px]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Total Users
                  </CardTitle>
                  <User size={25} />
                </div>
              </CardHeader>
              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {userGuard.length > 0 ? userGuard.length : 0}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Represents the total number of guards who will scan the
                  barcode on the gatepass.
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
                  {truckData.length > 0 ? truckData.length : 0}
                </h1>
                <p className="text-sm text-[#6c757d] mt-5">
                  Total number of trucks you own and have available for your
                  operations or transport needs.
                </p>
              </CardContent>
            </Card>
          </div>
          <AdminSummaryTable
            data={shipmentsData}
            preDeliveryData={preDeliveryData}
          />
        </>
      )}
    </div>
  );
}
