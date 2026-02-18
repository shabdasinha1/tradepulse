import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      
      <Footer />

    </>
  );
};

export default PublicLayout;
