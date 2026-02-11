import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiPlus, FiStar } from "react-icons/fi";

const suppliers = [
  {
    name: "Lagos Trading Co.",
    country: "Nigeria",
    score: 94,
    status: "Verified",
    trades: 234,
    catalog: "156 items",
  },
  {
    name: "Accra Exports Ltd",
    country: "Ghana",
    score: 88,
    status: "Verified",
    trades: 189,
    catalog: "203 items",
  },
  {
    name: "Abidjan Commerce",
    country: "Côte d’Ivoire",
    score: 76,
    status: "Verified",
    trades: 89,
    catalog: "78 items",
  },
  {
    name: "Nairobi Suppliers",
    country: "Kenya",
    score: 82,
    status: "Pending",
    trades: 45,
    catalog: "92 items",
  },
  {
    name: "Dar Es Salaam Traders",
    country: "Tanzania",
    score: 91,
    status: "Verified",
    trades: 167,
    catalog: "134 items",
  },
  {
    name: "Kampala Exports",
    country: "Uganda",
    score: 79,
    status: "Verified",
    trades: 98,
    catalog: "87 items",
  },
];

const Suppliers = () => {
  return (
    
      <section className="tp-section tp-section--dashboard">
        <div className="tp-container tp-grid-stack">

          {/* ===============================
              PAGE HEADER
          =============================== */}
          <header>
            <h1 className="tp-section-title">
              Trusted <span>Suppliers</span>
            </h1>
            <p className="tp-section-sub">
              Verified trade partners across African markets
            </p>
          </header>

          {/* ===============================
              SUPPLIERS TABLE
          =============================== */}
          <TradePulseCard
            header={
              <div className="tp-card-header tp-supplier-header">
                <h3 className="tp-card-title">Supplier Directory</h3>

                <button className="tp-btn-primary tp-btn-sm">
                  <FiPlus />
                  Add Supplier
                </button>
              </div>
            }
          >

            {/* TABLE HEAD */}
            <div className="tp-table-head tp-table-suppliers">
              <span>Supplier</span>
              <span>Country</span>
              <span>Trust</span>
              <span>Status</span>
              <span>Trades</span>
              <span>Catalog</span>
              <span />
            </div>

            {/* TABLE BODY */}
            <div className="tp-table">
              {suppliers.map((s, i) => (
                <div key={i} className="tp-table-row tp-table-suppliers">

                  <div className="supplier-name">
                    <strong>{s.name}</strong>
                  </div>

                  <span className="tp-muted">{s.country}</span>

                  <span
                    className={`tp-pill ${
                      s.score >= 85
                        ? "tp-pill-success"
                        : "tp-pill-warning"
                    }`}
                  >
                    {s.score}
                  </span>

                  <span
                    className={`tp-pill ${
                      s.status === "Verified"
                        ? "tp-pill-success"
                        : "tp-pill-warning"
                    }`}
                  >
                    {s.status}
                  </span>

                  <strong>{s.trades}</strong>

                  <a className="supplier-link">{s.catalog}</a>

                  <FiStar className="tp-star" />

                </div>
              ))}
            </div>

          </TradePulseCard>

        </div>
      </section>
  
  );
};

export default Suppliers;
