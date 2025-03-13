// component
import Heading from "@/components/header/page-heading";
import LoadingSpinner from "@/components/loading/loading-spinner";

// context
import { useAuth } from "@/context/AuthContextProvider";

// react-router-dom
import { useNavigate } from "react-router";

// react
import { useState } from "react";

export default function AdminSettingsPage() {
  // context
  const { user, signOut } = useAuth();

  // get the username
  const username = user.username;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // react-router
  const navigate = useNavigate();

  // sign out function
  const handleSignOut = () => {
    setIsLoading(true); // Start loading state

    signOut(); // Sign out the user

    setTimeout(() => {
      navigate("/signin"); // Redirect after 1 second
      setIsLoading(false); // Stop loading (optional, since user will navigate)
    }, 1000);
  };
  return (
    <div className="my-5 mx-4 w-[100vh]">
      <div>
        <Heading
          title={"account settings"}
          description={`View your account details`}
        />

        <div className="max-w-[350px]">
          <div className="flex flex-col my-5  ">
            <label className="font-inter text-sm">Username</label>
            <input
              value={username}
              type="text"
              placeholder="Enter username"
              className="border-none bg-gray-200 outline-none p-3 rounded-lg mt-2 cursor-not-allowed text-gray-500 "
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
