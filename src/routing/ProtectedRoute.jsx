// react-router dom
import { Navigate } from "react-router";

// context
import { useAuth } from "@/context/AuthContextProvider";

// prop-types validation
import PropTypes from "prop-types";

// utils
import { getRedirectPath } from "@/utils/getRedirectPath";

// this component will protect the authenticated route, role-based route by someone who want to access.
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // or show a loading screen

  // if no user. meaning not logged in, redirect to sign in page.
  if (!user) {
    return <Navigate to={"/signin"} replace />;
  }

  // check their role and redirect the user based on their role.
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={getRedirectPath(user.role)} replace />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};
