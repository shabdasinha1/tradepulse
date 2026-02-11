const products = [
  {
    name: "Crude Oil",
    category: "Commodity",
    price: "$78.45",
    change: "+1.8%",
    trend: "up",
    status: "Active",
  },
  {
    name: "Gold",
    category: "Commodity",
    price: "$2,032.10",
    change: "-0.6%",
    trend: "down",
    status: "Active",
  },
  {
    name: "EUR / USD",
    category: "Forex",
    price: "1.0842",
    change: "+0.3%",
    trend: "up",
    status: "Active",
  },
  {
    name: "Bitcoin",
    category: "Crypto",
    price: "$42,180",
    change: "-2.1%",
    trend: "down",
    status: "Inactive",
  },
];

const DashboardProduct = () => {
  return (
    
      <section className="tp-section">
        <div className="tp-container tp-grid-stack">
          
          {/* ===============================
              PAGE HEADER
          =============================== */}
          <header>
            <h1 className="tp-section-title">
              Products <span>Overview</span>
            </h1>
            <p className="tp-section-sub">
              Tradable instruments and current market snapshot
            </p>
          </header>

          {/* ===============================
              KPI CARDS
          =============================== */}
          <div className="tp-grid tp-grid-2">
            <div className="tp-card">
              <p className="tp-muted">Total Products</p>
              <h3>24</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Active Products</p>
              <h3>18</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Top Gainer</p>
              <h3 className="tp-text-up">Crude Oil</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Top Loser</p>
              <h3 className="tp-text-down">Bitcoin</h3>
            </div>
          </div>

          {/* ===============================
              PRODUCT TABLE
          =============================== */}
          <div className="tp-card">
            <div className="product-table">

              <div className="product-row product-head">
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Change</span>
                <span>Status</span>
              </div>

              {products.map((item, index) => (
                <div className="product-row" key={index}>
                  <span>{item.name}</span>
                  <span className="tp-muted">{item.category}</span>
                  <span>{item.price}</span>
                  <span
                    className={
                      item.trend === "up"
                        ? "tp-text-up"
                        : "tp-text-down"
                    }
                  >
                    {item.change}
                  </span>
                  <span
                    className={`tp-pill ${
                      item.status === "Active"
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
              INSIGHTS
          =============================== */}
          <div className="tp-grid tp-grid-2">
            <div className="tp-card">
              <p className="tp-muted">Most Traded Product</p>
              <h3>Gold</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Highest Volatility</p>
              <h3>Bitcoin</h3>
            </div>
          </div>

        </div>
      </section>
   
  );
};

export default DashboardProduct;
