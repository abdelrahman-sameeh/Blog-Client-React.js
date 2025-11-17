import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLoggedInUser } from "../../hooks/useGetLoggedInUser";

export const HasPreferences = () => {
  const { user, loading } = useLoggedInUser();
  const location = useLocation();
  const skipRoutes = ["/dashboard/user/preferences"];
  
  if (skipRoutes.includes(location.pathname)) {
    return <Outlet />;
  }

  if (
    (!user?._id || user.role == "admin" || user.preferences?.length) &&
    !loading
  ) {
    return <Outlet />;
  } else if (!loading) {
    return <Navigate to={"/dashboard/user/preferences"} />;
  }
};
