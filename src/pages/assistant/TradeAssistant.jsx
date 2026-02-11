import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiMessageSquare, FiSend, FiZap } from "react-icons/fi";

const suggestions = [
  "What is palm oil price trend?",
  "Best suppliers in Nigeria?",
  "GBP exchange rate forecast?",
  "Shipping cost to Lagos?",
];

const TradeAssistant = () => {
  return (
    <main>
      <section className="tp-section tp-section--dashboard">
        <div className="tp-container">

          <TradePulseCard
            header={
              <div className="tp-card-header tp-ai-header">
                <div className="tp-ai-title">
                  <FiZap />
                  <h3 className="tp-card-title">AI Trade Assistant</h3>
                </div>

                <span className="tp-pill tp-pill-primary">Beta</span>
              </div>
            }
          >

            {/* ===============================
                EMPTY / INTRO STATE
            =============================== */}
            <div className="tp-ai-body">
              <div className="tp-ai-icon-wrap">
                <FiMessageSquare />
              </div>

              <p className="tp-ai-text">
                Ask me anything about trade data, pricing, suppliers, or market trends.
              </p>

              <div className="tp-ai-suggestions">
                {suggestions.map((s, i) => (
                  <button key={i} className="tp-ai-chip">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* ===============================
                INPUT AREA
            =============================== */}
            <div className="tp-ai-input">
              <input
                type="text"
                className="tp-input"
                placeholder="Ask about commodities, suppliers, prices, trends..."
              />

              <button className="tp-btn-primary tp-ai-send">
                <FiSend />
                <span>Send</span>
              </button>
            </div>

          </TradePulseCard>

        </div>
      </section>
    </main>
  );
};

export default TradeAssistant;
