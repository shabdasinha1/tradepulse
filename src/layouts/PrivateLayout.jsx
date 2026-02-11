import DashboardHeader from "../components/header/DashboardHeader.jsx";

const PrivateLayout = ({ children }) => {
  return (
    <>
      <DashboardHeader />
      <main>
        {children}
      </main>
    </>
  );
};

export default PrivateLayout;
