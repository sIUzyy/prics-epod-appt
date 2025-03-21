// ---- react ----
import { useState, useEffect } from "react";

// ---- component ----
import AdminOrderItemsTable from "@/components/admin-components/admin-order-items-table";
import LoadingTable from "@/components/loading/loading-table";
import LoadingCard from "@/components/loading/loading-card";
import Heading from "@/components/header/page-heading";

// ---- shadcn component ----
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---- library ----
import { useParams } from "react-router"; // ---- react router dom
import { Hash, Truck } from "lucide-react"; // ---- icon
import { toast } from "sonner"; // ---- toast
import axios from "axios"; // axios

// ---- backend endpoint ----
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

// this page is specifically for order summary by tracking no.
export default function AdminOrderSummaryById() {
  // ----state for product code data list
  const [productCodes, setProductCodes] = useState([]);

  // ---- state to stored the pre-delivery data (when user scan the tracking no.)
  const [preDeliveryData, setPreDeliveryData] = useState([]);

  // ---- loading state
  const [isLoading, setIsLoading] = useState(false);

  // ---- get the tracking no /:id
  const { id } = useParams();

  // ---- fetch the product code by its tracking no
  useEffect(() => {
    const fetchProductCodes = async () => {
      setIsLoading(true);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_ENDPOINT}/api/productcode/${id}`
        );
        setProductCodes(response.data.productCodes || []);
      } catch (error) {
        console.error("Error fetching product codes:", error);
        toast.error(
          "We could not load your customer order data. Please try again later.",
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

    if (id) {
      fetchProductCodes();
    }
  }, [id]);

  // ---- fetch pre-delivery data for each product code tracking no.
  useEffect(() => {
    // if productcode length is 0, end.
    if (productCodes.length === 0) return;

    // function to fetch pre-delivery data
    const fetchPreDeliveryData = async () => {
      try {
        // request to backend
        const requests = productCodes.map((product) =>
          axios.get(
            `${API_ENDPOINT}/api/pre-delivery/${product.trackingNo}` // pass the product code tracking no
          )
        );

        // wait for all API calls
        const responses = await Promise.all(requests);

        // map thru each response
        const preDeliveryResults = responses.map((res) => res.data);

        // extract to state
        setPreDeliveryData(preDeliveryResults);
      } catch (error) {
        console.error("Failed to fetch pre-delivery data:", error);

        toast.error(
          "We could not load your pre-delivery data. Please try again later.",
          {
            style: {
              backgroundColor: "#ff4d4d",
              color: "#fff",
            },
          }
        );
      }
    };

    fetchPreDeliveryData();
  }, [productCodes]);

  return (
    <div className="my-5 mx-4">
      <Heading
        title={`dashboard > ${id}`}
        description={`Below is an overview of customer orders per tracking number.`}
      />
      {isLoading ? (
        <div>
          <LoadingCard />
          <LoadingTable />
        </div>
      ) : (
        <>
          <div className="flex gap-x-3">
            <Card className={"min-w-[400px] min-h-[150]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Tracking Number
                  </CardTitle>
                  <Hash size={20} />
                </div>
              </CardHeader>

              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">{id}</h1>
              </CardContent>
            </Card>

            <Card className={"min-w-[400px] min-h-[150]"}>
              <CardHeader>
                <div className="flex justify-between items-center ">
                  <CardTitle className={"font-inter text-base font-medium"}>
                    Total Customer Orders
                  </CardTitle>
                  <Truck size={25} />
                </div>
              </CardHeader>

              <CardContent>
                <h1 className="text-5xl font-bebas tracking-wider">
                  {productCodes.length > 0 ? productCodes.length : 0}
                </h1>
              </CardContent>
            </Card>
          </div>

          <AdminOrderItemsTable
            data={productCodes}
            preDeliveryData={preDeliveryData}
          />
        </>
      )}
    </div>
  );
}
