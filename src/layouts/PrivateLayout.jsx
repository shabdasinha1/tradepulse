import { DashboardFooter } from "../components/footer/DashboardFooter.jsx";
import DashboardHeader from "../components/header/DashboardHeader.jsx";

const PrivateLayout = ({ children }) => {
  return (
    <div className="tp-private-layout-wrapper">
      <DashboardHeader />
      <main>
        {children}
      </main>
      <DashboardFooter/>
    </div>
  );
};

export default PrivateLayout;
