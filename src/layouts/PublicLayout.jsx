import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";
import EarlyFeedbackWidget from "../components/common/EarlyFeedbackWidget.jsx";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      
      <Footer />
      <EarlyFeedbackWidget/>

    </>
  );
};

export default PublicLayout;
