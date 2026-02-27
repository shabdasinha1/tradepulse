const reports = [
  {
    date: "12 Sep 2025",
    product: "Gold",
    trades: 18,
    pnl: "+$1,240",
    trend: "up",
    status: "Profitable",
  },
  {
    date: "11 Sep 2025",
    product: "Crude Oil",
    trades: 12,
    pnl: "-$430",
    trend: "down",
    status: "Loss",
  },
  {
    date: "10 Sep 2025",
    product: "EUR / USD",
    trades: 22,
    pnl: "+$860",
    trend: "up",
    status: "Profitable",
  },
  {
    date: "09 Sep 2025",
    product: "Bitcoin",
    trades: 9,
    pnl: "-$1,120",
    trend: "down",
    status: "Loss",
  },
];

const Report = () => {
  return (

      <section className="tp-section">
        <div className="tp-dashboard-container tp-grid-stack">

          {/* ===============================
              PAGE HEADER
          =============================== */}
          <header>
            <h1 className="tp-section-title">
              Trading <span>Reports</span>
            </h1>
            <p className="tp-section-sub">
              Historical performance and execution analytics
            </p>
          </header>
 
          {/* ===============================
              KPI CARDS
          =============================== */}
          <div className="tp-grid tp-product-overview-grid">
            <div className="tp-card">
              <p className="tp-muted">Total Trades</p>
              <h3>126</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Win Rate</p>
              <h3>64%</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Net P/L</p>
              <h3 className="tp-text-up">+$3,420</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Avg Trade Duration</p>
              <h3>2.4 hrs</h3>
            </div>
          </div>

          {/* ===============================
              FILTERS
          =============================== */}
          <div className="tp-card reports-filters">
            <input
              type="date"
              className="tp-input"
              placeholder="Select date"
            />

            <select className="tp-input tp-select">
              <option>All Products</option>
              <option>Gold</option>
              <option>Crude Oil</option>
              <option>EUR / USD</option>
              <option>Bitcoin</option>
            </select>

            <button className="tp-btn-outline">
              Apply Filters
            </button>
          </div>

          {/* ===============================
              REPORT TABLE
          =============================== */}
          <div className="tp-card">
            <div className="reports-table">

              <div className="reports-row reports-head">
                <span>Date</span>
                <span>Product</span>
                <span>Trades</span>
                <span>P / L</span>
                <span>Status</span>
              </div>

              {reports.map((item, index) => (
                <div className="reports-row" key={index}>
                  <span>{item.date}</span>
                  <span className="tp-muted">{item.product}</span>
                  <span>{item.trades}</span>
                  <span
                    className={
                      item.trend === "up"
                        ? "tp-text-up"
                        : "tp-text-down"
                    }
                  >
                    {item.pnl}
                  </span>
                  <span
                    className={`tp-pill ${
                      item.status === "Profitable"
                        ? "tp-pill-success"
                        : "tp-pill-warning"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* ===============================
              EXPORT
          =============================== */}
          <div className="tp-card reports-export">
            <div>
              <h3>Export Report</h3>
              <p className="tp-muted">
                Download detailed performance reports for compliance and review
              </p>
            </div>

            <button className="tp-btn-primary">
              Download Report
            </button>
          </div>

        </div>
      </section>
   
  );
};

export default Report;
