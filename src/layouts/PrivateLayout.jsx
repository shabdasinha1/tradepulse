import { useState } from "react";
import DashboardSidebar from "../components/header/DashboardSidebar.jsx";
import { DashboardFooter } from "../components/footer/DashboardFooter.jsx";
import DashboardHeader from "../components/header/DashboardHeader.jsx";

const PrivateLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="tp-private-layout-wrapper">

      <DashboardSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="tp-dashboard-main">

        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="tp-dashboard-scroll">
          {children}
        </div>

        <DashboardFooter />

      </div>
    </div>
  );
};

export default PrivateLayout;