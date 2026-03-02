import { FiBox } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";

const duties = [
  {
    title: "Agricultural Products",
    rate: "5–15%",
    note: "Recently reduced",
    trend: "down",
  },
  {
    title: "Electronics",
    rate: "10–20%",
    note: "Standard rate",
    trend: "neutral",
  },
  {
    title: "Textiles",
    rate: "20–35%",
    note: "Protected sector",
    trend: "up",
  },
];

const CustomsDutyRates = ({ corridorId }) => {
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container">

        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiBox />
              <h3 className="tp-card-title">
                UK Import Duty Snapshot (Selected Corridor)
              </h3>
            </div>
          }
        >
          <div className="tp-grid tp-duty-grid">
            {duties.map((item, i) => (
              <div key={i} className="tp-duty-card">

                <span className="tp-duty-title">
                  {item.title}
                </span>

                <strong
                  className={`tp-duty-rate ${
                    item.trend === "down"
                      ? "tp-text-up"
                      : item.trend === "up"
                      ? "tp-text-down"
                      : "tp-text-neutral"
                  }`}
                >
                  {item.rate}
                </strong>

                <span className="tp-duty-note tp-muted">
                  {item.trend === "down" && "↓ "}
                  {item.trend === "up" && "↑ "}
                  {item.note}
                </span>

              </div>
            ))}
          </div>
        </TradePulseCard>

      </div>
    </section>
  );
};

export default CustomsDutyRates;