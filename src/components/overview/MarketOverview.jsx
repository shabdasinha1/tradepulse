import { FiDollarSign, FiTruck } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";


const MarketOverview = () => {
  const rates = [
    { symbol: "$", pair: "USD/NGN", value: "₦1,547.23", change: "+0.12%", type: "up" },
    { symbol: "£", pair: "GBP/NGN", value: "₦1,956.45", change: "+0.25%", type: "up" },
    { symbol: "€", pair: "EUR/NGN", value: "₦1,678.90", change: "-0.08%", type: "down" },
    { symbol: "¥", pair: "CNY/NGN", value: "₦214.56", change: "+0.15%", type: "up" },
    { symbol: "CFA", pair: "XOF/NGN", value: "₦2.48", change: "0.00%", type: "neutral" },
  ];

  const shipping = [
    {
      route: "London → Lagos",
      port: "Apapa Port",
      price: "£2,450",
      days: "28 days",
      change: "+3%",
      type: "up",
    },
    {
      route: "London → Port Harcourt",
      port: "Onne Port",
      price: "£2,680",
      days: "32 days",
      change: "+5%",
      type: "up",
    },
    {
      route: "Shanghai → Lagos",
      port: "Tin Can Port",
      price: "£1,890",
      days: "35 days",
      change: "-2%",
      type: "down",
    },
    {
      route: "Hamburg → Lagos",
      port: "Apapa Port",
      price: "£2,120",
      days: "26 days",
      change: "+1%",
      type: "up",
    },
  ];

  return (
    <section className="tp-section">
      <div className="tp-container tp-grid-stack">

        {/* ================= EXCHANGE RATES ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiDollarSign />
              <h3 className="tp-card-title">Exchange Rates vs NGN</h3>
            </div>
          }
        >
          <div className="tp-grid tp-rates-grid">
            {rates.map((r, i) => (
              <div key={i} className="tp-rate-card">

                <div className="tp-rate-header">
                  <span className="tp-rate-symbol">{r.symbol}</span>
                  <span
                    className={`tp-rate-change ${
                      r.type === "up"
                        ? "tp-text-up"
                        : r.type === "down"
                        ? "tp-text-down"
                        : "tp-text-neutral"
                    }`}
                  >
                    {r.change}
                  </span>
                </div>

                <span className="tp-rate-pair">{r.pair}</span>
                <strong className="tp-rate-value">{r.value}</strong>

              </div>
            ))}
          </div>
        </TradePulseCard>

        {/* ================= SHIPPING COSTS ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header">
              <FiTruck />
              <h3 className="tp-card-title">Latest Shipping Costs</h3>
            </div>
          }
        >
          <div className="tp-grid tp-ship-grid">
            {shipping.map((s, i) => (
              <div key={i} className="tp-ship-card">

                <div className="tp-ship-header">
                  <div>
                    <h4 className="tp-ship-route">{s.route}</h4>
                    <span className="tp-ship-port">{s.port}</span>
                  </div>

                  <span className="tp-ship-days">{s.days}</span>
                </div>

                <div className="tp-ship-footer">
                  <strong className="tp-ship-price">{s.price}</strong>
                  <span
                    className={`tp-ship-change ${
                      s.type === "up"
                        ? "tp-text-up"
                        : "tp-text-down"
                    }`}
                  >
                    {s.change}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </TradePulseCard>

      </div>
    </section>
  );
};

export default MarketOverview;
