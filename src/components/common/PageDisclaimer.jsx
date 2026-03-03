import { FiInfo } from "react-icons/fi";

const PageDisclaimer = () => {
  return (
    <div className="tp-disclaimer">
      <div className="tp-disclaimer-inner">
        <FiInfo className="tp-disclaimer-icon" />

        <p className="tp-disclaimer-text">
          <strong>Important:</strong> TradePulseAI does not facilitate
          transactions. We provide structured exporter reliability
          signals to support sourcing decisions.
        </p>
      </div>
    </div>
  );
};

export default PageDisclaimer;