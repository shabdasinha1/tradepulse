import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiStar, FiCheck } from "react-icons/fi";

const Watchlist = () => {
  return (
    <section className="tp-section">
      <div className="tp-container">

        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiStar />
              <h3 className="tp-card-title">Your Watchlist</h3>
            </div>
          }
        >
          <div className="tp-grid tp-watchlist-grid">

            {/* COMMODITY CARD */}
            <div className="tp-watchlist-card">
              <div className="tp-watchlist-top">
                <div>
                  <strong>Palm Oil</strong>
                  <div className="tp-muted">Agriculture</div>
                </div>
                <FiStar className="active" />
              </div>

              <div className="tp-watchlist-price">
                £1,245/ton
              </div>

              <div className="tp-watchlist-bottom">
                <span className="tp-muted">Lagos</span>
                <span className="tp-text-up">↗ +5.2%</span>
              </div>
            </div>

            {/* SUPPLIER CARD */}
            <div className="tp-watchlist-card">
              <div className="tp-watchlist-top">
                <div>
                  <strong>Lagos Trading Co.</strong>
                  <div className="tp-muted">Nigeria</div>
                </div>
                <FiStar className="active" />
              </div>

              <div className="tp-watchlist-meta">
                <span className="tp-score">94</span>
                <span className="tp-verified">
                  <FiCheck /> Verified
                </span>
              </div>

              <div className="tp-watchlist-bottom">
                <span />
                <span className="tp-muted">234 trades</span>
              </div>
            </div>

          </div>
        </TradePulseCard>

      </div>
    </section>
  );
};

export default Watchlist;
