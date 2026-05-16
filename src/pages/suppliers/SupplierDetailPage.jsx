import React from "react";
import TPChart from "../../components/common/TPChart";


const SupplierDetailPage = ({ supplier, onBack }) => {
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">

        {/* HEADER CARD */}
        <div className="tp-supplier-detail-hero">

          {/* LEFT */}
          <div className="tp-supplier-detail-left">

            {/* SCORE */}
            <div className="tp-supplier-score-ring">
              <div className="tp-supplier-score-inner">
                <span className="tp-supplier-score-value tp-font-data">
                  {Math.round((supplier?.reliability_score || 0) * 100)}
                </span>

                <span className="tp-supplier-score-label">
                  /100
                </span>
              </div>
            </div>

            {/* INFO */}
            <div className="tp-supplier-detail-info">

              <div className="tp-supplier-detail-top-row">

                <h1 className="tp-supplier-detail-title">
                  {supplier?.company_name}
                </h1>

                <div className="tp-supplier-detail-tags">

                  <span className="tp-pill tp-pill-success">
                    VERIFIED
                  </span>

                  <span className="tp-pill tp-pill-primary">
                    NO SANCTIONS
                  </span>

                </div>
              </div>

              <p className="tp-supplier-detail-sub">
                {supplier?.country_name || "Nigeria"} ·{" "}
                {supplier?.sector || "Agriculture"} · 9 years in business ·
                1,103 shipments
              </p>

            </div>
          </div>

          {/* RIGHT */}
          <div className="tp-supplier-detail-actions">

            <button className="tp-btn-outline">
              Watchlist
            </button>

            <button className="tp-btn-primary">
              Add to Report
            </button>

            <button
              className="tp-btn-outline"
              onClick={onBack}
            >
              ← Back
            </button>

          </div>
        </div>

        {/* AI ASSESSMENT */}
        <div className="tp-ai-assessment-card">

          <div className="tp-ai-assessment-label">
            • AI SUPPLIER ASSESSMENT
          </div>

          <p className="tp-ai-assessment-text">
            {supplier?.company_name} has maintained consistent export
            activity for 9 years with 1,103 logged shipments and no
            sanctions flags. Verification is complete. Reliability
            score of{" "}
            {Math.round((supplier?.reliability_score || 0) * 100)}
            reflects strong operational consistency.
          </p>

          <div className="tp-ai-assessment-footer">

            <div className="tp-ai-risk">
              <span className="tp-ai-dot"></span>

              <span className="tp-ai-risk-label">
                Risk Level:
              </span>

              <span className="tp-ai-risk-value">
                LOW
              </span>
            </div>

            <span className="tp-ai-date">
              Last admin-verified: 01 Mar 2026
            </span>

          </div>
        </div>

{/* =========================================
    VERIFICATION + SCORE GRID
========================================= */}

<div className="tp-supplier-analysis-grid">

  {/* LEFT CARD */}
  <div className="tp-supplier-analysis-card">

    <div className="tp-supplier-analysis-label">
      • VERIFICATION FLAGS
    </div>

    <div className="tp-verification-list">

      {/* ITEM */}
      <div className="tp-verification-item">
        <div className="tp-verification-icon success">
          ✓
        </div>

        <div className="tp-verification-content">
          <h4>Pricing Consistency</h4>

          <p>
            Within 8% of market benchmark for cocoa exports —
            no anomalies detected
          </p>
        </div>
      </div>

      {/* ITEM */}
      <div className="tp-verification-item">
        <div className="tp-verification-icon success">
          ✓
        </div>

        <div className="tp-verification-content">
          <h4>Description Consistency</h4>

          <p>
            Export descriptions match company registry
            documentation
          </p>
        </div>
      </div>

      {/* ITEM */}
      <div className="tp-verification-item">
        <div className="tp-verification-icon success">
          ✓
        </div>

        <div className="tp-verification-content">
          <h4>Years in Business</h4>

          <p>
            9 years trading history — above 5-year minimum threshold
          </p>
        </div>
      </div>

      {/* ITEM */}
      <div className="tp-verification-item">
        <div className="tp-verification-icon success">
          ✓
        </div>

        <div className="tp-verification-content">
          <h4>Registration Match</h4>

          <p>
            RC-428-7733 confirmed against CAC Nigeria registry
          </p>
        </div>
      </div>

      {/* WARNING */}
      <div className="tp-verification-item">
        <div className="tp-verification-icon warning">
          !
        </div>

        <div className="tp-verification-content">
          <h4>Certificate Availability</h4>

          <p>
            NAFDAC cert expires 14 May 2026 (43 days).
            Renewal in progress per supplier portal.
          </p>
        </div>
      </div>

      {/* ITEM */}
      <div className="tp-verification-item">
        <div className="tp-verification-icon success">
          ✓
        </div>

        <div className="tp-verification-content">
          <h4>Shipping Anomalies</h4>

          <p>
            No unexplained shipment gaps or routing anomalies
            detected in 12-month window
          </p>
        </div>
      </div>

    </div>
  </div>

  {/* RIGHT CARD */}
  <div className="tp-supplier-analysis-card">

    <div className="tp-supplier-analysis-label">
      • RELIABILITY SCORE BREAKDOWN
    </div>

    <div className="tp-score-breakdown-list">

      {/* ROW */}
      <div className="tp-score-breakdown-item">

        <div className="tp-score-breakdown-top">
          <span>Verification Completeness</span>

          <span className="tp-score-value success">
            72/100
          </span>
        </div>

        <div className="tp-score-progress">
          <div
            className="tp-score-progress-fill success"
            style={{ width: "72%" }}
          />
        </div>
      </div>

      {/* ROW */}
      <div className="tp-score-breakdown-item">

        <div className="tp-score-breakdown-top">
          <span>Shipment History</span>

          <span className="tp-score-value success">
            94/100
          </span>
        </div>

        <div className="tp-score-progress">
          <div
            className="tp-score-progress-fill success"
            style={{ width: "94%" }}
          />
        </div>
      </div>

      {/* ROW */}
      <div className="tp-score-breakdown-item">

        <div className="tp-score-breakdown-top">
          <span>Activity Level</span>

          <span className="tp-score-value success">
            88/100
          </span>
        </div>

        <div className="tp-score-progress">
          <div
            className="tp-score-progress-fill success"
            style={{ width: "88%" }}
          />
        </div>
      </div>

      {/* WARNING */}
      <div className="tp-score-breakdown-item">

        <div className="tp-score-breakdown-top">
          <span>Flag Count Score</span>

          <span className="tp-score-value warning">
            61/100
          </span>
        </div>

        <div className="tp-score-progress">
          <div
            className="tp-score-progress-fill warning"
            style={{ width: "61%" }}
          />
        </div>
      </div>

    </div>
  </div>
</div>

{/* =========================================
    HISTORICAL SHIPMENT TREND
========================================= */}

<div className="tp-shipment-trend-section">

  <div className="tp-supplier-analysis-label">
    • HISTORICAL SHIPMENT TREND
  </div>

  <div className="tp-shipment-trend-card">

    {/* TOP */}
    <div className="tp-shipment-trend-top">

      <div>

        <div className="tp-shipment-chart-title">
          {supplier?.company_name} · Shipment Frequency
        </div>

        <div className="tp-shipment-chart-subtitle">
          Quarterly shipment activity intelligence
        </div>

      </div>

      <div className="tp-shipment-trend-pill">
        +18.4% YoY
      </div>

    </div>

    {/* CHART */}
    <div className="tp-shipment-chart-main">

      <TPChart
        title=""
        type="bar"
        xKey="quarter"
        data={[
          { quarter: "Q1 '22", shipments: 58 },
          { quarter: "Q2 '22", shipments: 66 },
          { quarter: "Q3 '22", shipments: 62 },
          { quarter: "Q4 '22", shipments: 72 },

          { quarter: "Q1 '23", shipments: 64 },
          { quarter: "Q2 '23", shipments: 78 },
          { quarter: "Q3 '23", shipments: 60 },
          { quarter: "Q4 '23", shipments: 70 },

          { quarter: "Q1 '24", shipments: 74 },
          { quarter: "Q2 '24", shipments: 82 },
          { quarter: "Q3 '24", shipments: 68 },
          { quarter: "Q4 '24", shipments: 78 },

          { quarter: "Q1 '25", shipments: 84 },
          { quarter: "Q2 '25", shipments: 92 },
          { quarter: "Q3 '25", shipments: 80 },
          { quarter: "Q4 '25", shipments: 94 },
        ]}
        series={[
          {
            key: "shipments",
            label: "Shipments",
          },
        ]}
      />

    </div>

    {/* FOOTER */}
    <div className="tp-shipment-trend-footer">

      <div className="tp-shipment-stat">

        <span className="tp-shipment-stat-label">
          Total Shipments
        </span>

        <span className="tp-shipment-stat-value">
          1,103
        </span>

      </div>

      <div className="tp-shipment-stat">

        <span className="tp-shipment-stat-label">
          Avg / Quarter
        </span>

        <span className="tp-shipment-stat-value">
          68
        </span>

      </div>

      <div className="tp-shipment-stat">

        <span className="tp-shipment-stat-label">
          Trend
        </span>

        <span className="tp-shipment-stat-value tp-text-up">
          Increasing
        </span>

      </div>

    </div>

  </div>

</div>

{/* =========================================
    PRODUCT EXPORT HISTORY
========================================= */}

<div className="tp-product-history-section">

  <div className="tp-supplier-analysis-label">
    • PRODUCT EXPORT HISTORY
  </div>

  {/* TABLE */}
  <div className="tp-product-history-table-wrapper">

    <div className="tp-product-history-table">

      {/* HEADER */}
      <div className="tp-product-history-head">

        <span>HS CODE</span>
        <span>PRODUCT</span>
        <span>VOLUME (T)</span>
        <span>PERIOD</span>
        <span>PRICE RANGE</span>

      </div>

      {/* ROW */}
      <div className="tp-product-history-row">

        <span className="tp-font-data">
          1801
        </span>

        <strong>
          Cocoa Beans
        </strong>

        <span className="tp-font-data">
          1,847 t
        </span>

        <span className="tp-font-data">
          2024–2026
        </span>

        <span className="tp-font-data">
          £2,690–£2,847
        </span>

      </div>

      {/* ROW */}
      <div className="tp-product-history-row">

        <span className="tp-font-data">
          1511.10
        </span>

        <strong>
          Palm Oil (crude)
        </strong>

        <span className="tp-font-data">
          890 t
        </span>

        <span className="tp-font-data">
          2023–2026
        </span>

        <span className="tp-font-data">
          £830–£920
        </span>

      </div>

      {/* ROW */}
      <div className="tp-product-history-row">

        <span className="tp-font-data">
          1207.40
        </span>

        <strong>
          Sesame Seeds
        </strong>

        <span className="tp-font-data">
          440 t
        </span>

        <span className="tp-font-data">
          2024–2026
        </span>

        <span className="tp-font-data">
          £1,100–£1,280
        </span>

      </div>

    </div>
  </div>

  {/* KEY FACTS */}
  <div className="tp-key-facts-card">

    <div className="tp-supplier-analysis-label">
      • KEY FACTS
    </div>

    <div className="tp-key-facts-grid">

      {/* LEFT */}
      <div className="tp-key-facts-column">

        <span>Registration No.</span>
        <span>Country</span>
        <span>Export Products</span>
        <span>Certifications</span>
        <span>NAFDAC Expiry</span>
        <span>Last Shipment</span>
        <span>Avg Lead Time</span>

      </div>

      {/* RIGHT */}
      <div className="tp-key-facts-column value">

        <span className="tp-font-data">
          RC-428-7733
        </span>

        <span className="tp-font-data">
          Nigeria
        </span>

        <span className="tp-font-data">
          Cocoa, Palm Oil, Sesame
        </span>

        <span className="tp-font-data">
          NAFDAC
        </span>

        <span className="tp-font-data">
          14 May 2026 (43 days)
        </span>

        <span className="tp-font-data">
          22 Mar 2026
        </span>

        <span className="tp-font-data">
          14–18 days
        </span>

      </div>

    </div>
  </div>
</div>
      </div>
    </section>
  );
};

export default SupplierDetailPage;