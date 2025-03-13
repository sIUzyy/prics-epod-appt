// component
import Heading from "@/components/header/page-heading";
import LoadingSpinner from "@/components/loading/loading-spinner";

// react
import { useState } from "react";

// axios
import axios from "axios";

// toast
import { toast } from "sonner";

// backend endpoint
const API_ENDPOINT = import.meta.env.VITE_BACKEND_API_ENDPOINT;

export default function AdminMaintenanceCreateAccount() {
  // state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [role, setRole] = useState("guard");

  // loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // check all if empty
    if (!name && !username && !password) {
      setNameError("Name field cannot be empty");
      setUsernameError("Username field cannot be empty");
      setPasswordError("Password field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check single field if empty
    if (!name) {
      setNameError("Name field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check single field if empty
    if (!username) {
      setUsernameError("Username field cannot be empty");
      setIsLoading(false);
      return;
    }

    // check single field if empty
    if (!password) {
      setPasswordError("Password field cannot be empty");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name,
        username,
        password,
        role: role,
      };

      const response = await axios.post(
        `${API_ENDPOINT}/api/user/signup`,
        userData
      );

      if (response.status === 201) {
        toast.success("Successfully created an account for the guard role!", {
          style: {
            backgroundColor: "#28a745",
            color: "#fff",
          },
        });

        setName("");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error("Failed to create guard account:", error);

      toast.error("Failed to create an account. Please try again later.", {
        style: {
          backgroundColor: "#ff4d4d",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-5 mx-4 w-[100vh]">
      <div>
        <Heading
          title={"Create Account"}
          description={`Create an account for the guard to scan the gate pass barcode.`}
        />

        <div className="max-w-[350px]">
          <div className="flex flex-col my-5  ">
            <label className="font-inter text-sm">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="border-1 outline-none p-3 rounded-lg mt-2 "
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
            />
            {nameError && (
              <p className="my-1 text-red-500 text-sm">{nameError}</p>
            )}
          </div>
          <div className="flex flex-col  ">
            <label className="font-inter text-sm">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="border-1 outline-none p-3 rounded-lg mt-2 "
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (usernameError) setUsernameError("");
              }}
            />
            {usernameError && (
              <p className="my-1 text-red-500 text-sm">{usernameError}</p>
            )}
          </div>
          <div className="flex flex-col clas my-5  ">
            <label className="font-inter text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="border-1 outline-none p-3 rounded-lg mt-2 "
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
            />
            {passwordError && (
              <p className="my-1 text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          <button
            onClick={handleRegister}
            className={
              isLoading
                ? "w-full p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-progress opacity-50"
                : "w-full p-3 rounded-md bg-[#1877F2] text-white font-inter font-bold hover:opacity-75 transition-opacity duration-300 2xl:p-4 cursor-pointer"
            }
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
