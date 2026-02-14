import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "agrahariumang222005@gmail.com";

const AdminRoute = ({ user, children }) => {
  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Logged in but not admin
  if (user.email !== ADMIN_EMAIL) {
    return (
      <h2 className="text-red-500 text-center mt-10 text-xl">
        You are not authorized to access Admin Dashboard.
      </h2>
    );
  }

  // Admin allowed
  return children;
};

export default AdminRoute;
