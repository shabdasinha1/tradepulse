const signals = [
  {
    asset: "Gold",
    signal: "Bullish",
    confidence: "78%",
    type: "success",
  },
  {
    asset: "Crude Oil",
    signal: "Neutral",
    confidence: "52%",
    type: "neutral",
  },
  {
    asset: "EUR / USD",
    signal: "Bullish",
    confidence: "64%",
    type: "success",
  },
  {
    asset: "Bitcoin",
    signal: "Bearish",
    confidence: "81%",
    type: "danger",
  },
];

const Forecast = () => {
  return (
  
      <section className="tp-section">
        <div className="tp-container tp-grid-stack">

          {/* ===============================
              PAGE HEADER
          =============================== */}
          <header>
            <h1 className="tp-section-title">
              Market <span>Forecast</span>
            </h1>
            <p className="tp-section-sub">
              Predictive signals and trend confidence indicators
            </p>
          </header>

          {/* ===============================
              KPI CARDS
          =============================== */}
          <div className="tp-grid tp-grid-2">
            <div className="tp-card">
              <p className="tp-muted">Bullish Signals</p>
              <h3 className="tp-text-up">6</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Bearish Signals</p>
              <h3 className="tp-text-down">3</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Neutral Assets</p>
              <h3>5</h3>
            </div>

            <div className="tp-card">
              <p className="tp-muted">Prediction Accuracy</p>
              <h3>71%</h3>
            </div>
          </div>

          {/* ===============================
              FORECAST CHART PLACEHOLDER
          =============================== */}
          <div className="tp-card">
            <div className="forecast-chart-header">
              <h3>Trend Projection</h3>
              <button className="tp-btn-outline">Last 7 Days</button>
            </div>

            <div className="forecast-chart">
              <div className="forecast-bar" style={{ width: "72%" }} />
            </div>

            <p className="tp-muted forecast-note">
              Visual representation of projected market momentum
            </p>
          </div>

          {/* ===============================
              SIGNAL LIST
          =============================== */}
          <div className="tp-card">
            <div className="forecast-table">

              <div className="forecast-row forecast-head">
                <span>Asset</span>
                <span>Signal</span>
                <span>Confidence</span>
              </div>

              {signals.map((item, index) => (
                <div className="forecast-row" key={index}>
                  <span>{item.asset}</span>

                  <span
                    className={`tp-pill ${
                      item.type === "success"
                        ? "tp-pill-success"
                        : item.type === "danger"
                        ? "tp-pill-warning"
                        : "tp-pill-primary"
                    }`}
                  >
                    {item.signal}
                  </span>

                  <span>{item.confidence}</span>
                </div>
              ))}

            </div>
          </div>

          {/* ===============================
              DISCLAIMER
          =============================== */}
          <div className="tp-card">
            <p className="tp-muted">
              Forecasts are algorithmic estimates based on historical patterns
              and should not be considered financial advice.
            </p>
          </div>

        </div>
      </section>
  
  );
};

export default Forecast;
