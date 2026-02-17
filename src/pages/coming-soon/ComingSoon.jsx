import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    
      <section className="tp-coming tp-section--cta tp-section--spacious tp-coming-section">
        <div className="tp-container">
          <div className="tp-coming-layout tp-coming--visible">

            <span className="tp-pill tp-pill-primary">
              TradePulse AI
            </span>

            <h1 className="tp-coming-title">
              Coming <span>Soon</span>
            </h1>

            <p className="tp-coming-sub">
              We’re building a next-generation cross border trade intelligence
              platform designed for clarity, confidence, and speed.
              <br />
              Early access is opening shortly.
            </p>

            <div className="tp-coming-actions">
              <button
                className="tp-btn-primary tp-coming-primary"
                onClick={() => navigate("/register")}
              >
                Join Early Access
              </button>

              {/* <button
                className="tp-btn-outline"
                onClick={() => navigate("/contact")}
              >
                Get Notified
              </button> */}
            </div>

          </div>
        </div>
      </section>
   
  );
};

export default ComingSoon;
