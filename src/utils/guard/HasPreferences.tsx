import { Navigate, Outlet } from "react-router-dom";
import { useLoggedInUser } from "../../hooks/useGetLoggedInUser"
import { Spinner } from "react-bootstrap";

export const HasPreferences = () => {
  const {user, loading} = useLoggedInUser(true)

  if (loading) {
    return <div className="d-flex justify-content-center align-item-center py-5">
      <Spinner animation="border" />
    </div>;
  }

  if((!user?._id || user.role=="admin" || user.preferences?.length) && !loading){
    return <Outlet />
  }else if(!loading){
    return <Navigate to={"/dashboard/user/preferences"} />
  }

}
