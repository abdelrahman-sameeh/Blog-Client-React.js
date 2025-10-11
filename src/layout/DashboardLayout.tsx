import { Footer } from "../components/utils/Footer";
import { Navbar } from "../components/utils/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/layout/DashboardSidebar";

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
