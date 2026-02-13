import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiTrash2, FiBell } from "react-icons/fi";

/* ===============================
   DATA ARRAYS (Scalable)
================================ */

const trackedProducts = [
  {
    title: "Electronics – Power Banks",
    sub: "Trend: +14%",
    pills: [
      { label: "Alert", type: "warning", icon: true },
      { label: "opportunity", type: "success" },
    ],
  },
  {
    title: "Textiles – Cotton Fabrics",
    sub: "Trend: +2%",
    pills: [{ label: "neutral", type: "warning" }],
  },
  {
    title: "Food – Spices",
    sub: "Trend: +9%",
    pills: [
      { label: "Alert", type: "warning", icon: true },
      { label: "opportunity", type: "success" },
    ],
  },
];

const trackedSuppliers = [
  {
    title: "Shanghai Electronics Co.",
    sub: "Trust Score: 9.2/10",
    pills: [{ label: "verified", type: "success" }],
  },
  {
    title: "Mumbai Textile Mills",
    sub: "Trust Score: 8.5/10",
    pills: [{ label: "verified", type: "success" }],
  },
  {
    title: "Bangkok Spice Trading",
    sub: "Trust Score: 7.8/10",
    pills: [
      { label: "Alert", type: "warning", icon: true },
      { label: "pending", type: "warning" },
    ],
  },
];

const currencyAlerts = [
  {
    title: "USD/NGN",
    sub: "1,650 (+2.3%)",
    pills: [{ label: "positive", type: "success" }],
  },
  {
    title: "USD/GHS",
    sub: "13.5 (-1.2%)",
    pills: [
      { label: "Alert", type: "warning", icon: true },
      { label: "negative", type: "warning" },
    ],
  },
  {
    title: "USD/KES",
    sub: "156.8 (+0.5%)",
    pills: [{ label: "neutral", type: "warning" }],
  },
];

const shippingRoutes = [
  {
    title: "Shanghai → Lagos",
    sub: "Delay: 0 days",
    pills: [{ label: "on-time", type: "success" }],
  },
  {
    title: "Mumbai → Nairobi",
    sub: "Delay: +3 days",
    pills: [
      { label: "Alert", type: "warning", icon: true },
      { label: "delayed", type: "warning" },
    ],
  },
  {
    title: "Bangkok → Accra",
    sub: "Delay: 0 days",
    pills: [{ label: "on-time", type: "success" }],
  },
];

/* ===============================
   REUSABLE ROW COMPONENT
================================ */

const WatchlistRow = ({ item }) => {
  return (
    <div className="tp-watchlist-row">
      <div>
        <strong>{item.title}</strong>
        <div className="tp-muted">{item.sub}</div>
      </div>

      <div className="tp-watchlist-actions">
        {item.pills?.map((pill, index) => (
          <span
            key={index}
            className={`tp-pill ${
              pill.type === "success"
                ? "tp-pill-success"
                : "tp-pill-warning"
            }`}
          >
            {pill.icon && <FiBell />}
            {pill.label}
          </span>
        ))}

        <FiTrash2 />
      </div>
    </div>
  );
};

/* ===============================
   REUSABLE SECTION COMPONENT
================================ */

const WatchlistSection = ({ title, data, countLabel }) => {
  return (
    <div className="tp-watchlist-section">
      <div className="tp-watchlist-section-head">
        <h3>{title}</h3>
        <span className="tp-muted">
          {data.length} {countLabel}
        </span>
      </div>

      <TradePulseCard>
        <div className="tp-watchlist-list">
          {data.map((item, index) => (
            <WatchlistRow key={index} item={item} />
          ))}
        </div>
      </TradePulseCard>
    </div>
  );
};

/* ===============================
   MAIN PAGE
================================ */

const Watchlist = () => {
  return (
    <section className="tp-section">
      <div className="tp-container tp-watchlist-page">

        <div className="tp-watchlist-header">
          <h1>Watchlist</h1>
          <p className="tp-muted">
            Track your selected trade interests and receive real-time alerts
          </p>
        </div>

        <WatchlistSection
          title="Tracked Products"
          data={trackedProducts}
          countLabel="items"
        />

        <WatchlistSection
          title="Tracked Suppliers"
          data={trackedSuppliers}
          countLabel="items"
        />

        <WatchlistSection
          title="Currency Alerts"
          data={currencyAlerts}
          countLabel="pairs"
        />

        <WatchlistSection
          title="Shipping Routes"
          data={shippingRoutes}
          countLabel="routes"
        />

      </div>
    </section>
  );
};

export default Watchlist;
