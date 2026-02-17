import { DashboardFooter } from "../components/footer/DashboardFooter.jsx";
import DashboardHeader from "../components/header/DashboardHeader.jsx";

const PrivateLayout = ({ children }) => {
  return (
    <>
      <DashboardHeader />
      <main>
        {children}
      </main>
      <DashboardFooter/>
    </>
  );
};

export default PrivateLayout;
