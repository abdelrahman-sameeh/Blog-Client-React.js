import { Navigate, Outlet } from "react-router-dom";
import { useLoggedInUser } from "../../hooks/useGetLoggedInUser";

export const IsAuth = () => {
  const { user, loading } = useLoggedInUser();

  if ((!user || !user._id) && !loading) {
    return <Navigate to="/login" replace />;
  }
  if (user._id && !loading) {
    return <Outlet />;
  }
};

