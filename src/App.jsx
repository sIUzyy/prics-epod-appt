// react-router-dom
import { RouterProvider } from "react-router-dom";

// src/routing/MainRoutes
import router from "./routing/MainRouting";

// toast
import { Toaster } from "sonner";

// context
import TrackingNoContextProvider from "./context/TrackingNoContextProvider";
import WarehouseContextProvider from "./context/WarehouseContextProvider";
import AuthContextProvider from "./context/AuthContextProvider";

// auth-context
import { useAuth } from "@/context/AuthContextProvider";

function AppContent() {
  const { user } = useAuth();

  // determine toaster position based on role
  const toasterPosition =
    user?.role === "admin" ? "bottom-right" : "bottom-left";

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position={toasterPosition} />
    </>
  );
}

export default function App() {
  return (
    <WarehouseContextProvider>
      <AuthContextProvider>
        <TrackingNoContextProvider>
          <AppContent />
        </TrackingNoContextProvider>
      </AuthContextProvider>
    </WarehouseContextProvider>
  );
}
