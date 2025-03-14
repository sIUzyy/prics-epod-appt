// components
import Heading from "@/components/header/page-heading";
import LoadingSpinner from "@/components/loading/loading-spinner";

// context
import { useAuth } from "@/context/AuthContextProvider";
import { useWarehouse } from "@/context/WarehouseContextProvider";

// react-router-dom
import { useNavigate } from "react-router";

// react
import { useState } from "react";

export default function UserSettingsPage() {
  // context
  const { user, signOut } = useAuth();
  const { selectedWarehouse } = useWarehouse();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // get the plate no
  const plateNo = user.plateNo;

  // react-router
  const navigate = useNavigate();

  // sign out function
  const handleSignOut = () => {
    setIsLoading(true); // Start loading state

    signOut(); // Sign out the user

    setTimeout(() => {
      navigate("/signin"); // Redirect after 1 second
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="my-5 mx-4 ">
      <div>
        <Heading
          title={"account settings"}
          description={`View your account details`}
        />

        <div className="min-w-[320px]">
          <div className="flex flex-col my-5  ">
            <label className="font-inter text-sm">Plate No.</label>
            <input
              value={plateNo}
              type="text"
              placeholder="Plate No."
              className="border-none bg-gray-200 outline-none p-3 rounded-lg mt-2 cursor-not-allowed text-gray-500 "
              disabled
            />
          </div>

          <div className="flex flex-col my-5">
            <label className="font-inter text-sm">Warehouse</label>
            <input
              value={selectedWarehouse}
              type="text"
              placeholder="Plate No."
              className="border-none bg-gray-200 outline-none p-3 rounded-lg mt-2 cursor-not-allowed text-gray-500 
               overflow-x-auto whitespace-nowrap text-ellipsis"
              disabled
            />
          </div>

          <button
            onClick={handleSignOut}
            className={
              isLoading
                ? "w-full p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-not-allowed opacity-50"
                : "w-full p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-pointer"
            }
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
