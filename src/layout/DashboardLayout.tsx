import { Footer } from "../components/utils/Footer";
import { DashboardSidebar } from "../components/utils/layout/DashboardSidebar";
import { Navbar } from "../components/utils/navbar/Navbar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="d-flex">
        <div className="dashboard-sidebar hide border-end shadow">
          <DashboardSidebar />
        </div>
        <div className="main-content">
          <div className="content">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
