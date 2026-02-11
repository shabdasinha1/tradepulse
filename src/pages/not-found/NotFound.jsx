import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="tp-section tp-404">
      <div className="tp-container tp-404-container">

        <div className="tp-404-card tp-card">

          <FiAlertTriangle className="tp-404-icon" />

          <h1 className="tp-404-title">404</h1>

          <p className="tp-404-sub">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          <button
            className="tp-btn-primary tp-404-btn"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            Go Back
          </button>

        </div>

      </div>
    </section>
  );
};

export default NotFound;
