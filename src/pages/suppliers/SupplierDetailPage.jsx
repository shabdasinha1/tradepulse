import React from "react";
import { useQuery } from "@tanstack/react-query";
import TPChart from "../../components/common/TPChart";

import {
  DashboardSupplierIntelligence,
  DashboardSupplierKeyFacts,
  DashboardSupplierExportHistory,
} from "../../services/DashboardService";

import { queryKeys } from "../../utils/queryKeys";


const SupplierDetailPage = ({ supplier, onBack }) => {

  const supplierId = supplier?.id;


/* ===============================
   SUPPLIER INTELLIGENCE
================================ */

const {
  data: supplierIntelligence,
  isLoading: intelligenceLoading,
} = useQuery({
  queryKey: queryKeys.supplierIntelligence(
    supplierId,
  ),

  queryFn: async () => {
    const res =
      await DashboardSupplierIntelligence(
        supplierId,
      );

    return res?.data || null;
  },

  enabled: !!supplierId,
});

/* ===============================
   SUPPLIER KEY FACTS
================================ */

const {
  data: supplierKeyFacts,
} = useQuery({
  queryKey: queryKeys.supplierKeyFacts(
    supplierId,
  ),

  queryFn: async () => {
    const res =
      await DashboardSupplierKeyFacts(
        supplierId,
      );

    return res?.data || null;
  },

  enabled: !!supplierId,
});

/* ===============================
   SUPPLIER EXPORT HISTORY
================================ */

const {
  data: supplierExportHistory,
} = useQuery({
  queryKey: queryKeys.supplierExportHistory(
    supplierId,
  ),

  queryFn: async () => {
    const res =
      await DashboardSupplierExportHistory(
        supplierId,
      );

    return res?.data || [];
  },

  enabled: !!supplierId,
});

const intelligence = supplierIntelligence;
const keyFacts = supplierKeyFacts;
const exportHistory = supplierExportHistory;

if (intelligenceLoading) {
  return (
    <div className="tp-section">
      <div className="tp-dashboard-container">
        Loading supplier intelligence...
      </div>
    </div>
  );
}

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
                 {intelligence?.reliability_score || 0}
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
                  {intelligence?.company_name || supplier?.company_name}
                </h1>

                <div className="tp-supplier-detail-tags">

                  <span className="tp-pill tp-pill-success">
                   {intelligence?.verification_status || "UNKNOWN"}
                  </span>

                  <span className="tp-pill tp-pill-primary">
                    NO SANCTIONS
                  </span>

                </div>
              </div>

              <p className="tp-supplier-detail-sub">
          {intelligence?.country_name || "-"} ·{" "}
{intelligence?.sector || "-"} ·{" "}
{intelligence?.years_in_business || 0} years in business ·{" "}
{intelligence?.product_count || 0} products
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
  {intelligence?.company_name} operates in{" "}
  {intelligence?.country_name} within the{" "}
  {intelligence?.sector} sector.

  Current reliability score is{" "}
  {intelligence?.reliability_score || 0}/100 with{" "}
  {intelligence?.verification_status} verification status.

  Supplier currently handles{" "}
  {intelligence?.product_count || 0} export product categories.
</p>

          <div className="tp-ai-assessment-footer">

            <div className="tp-ai-risk">
              <span className="tp-ai-dot"></span>

              <span className="tp-ai-risk-label">
                Risk Level:
              </span>

              <span className="tp-ai-risk-value">
              {intelligence?.sanctions?.sanctions_flag ? "HIGH" : "LOW"}
              </span>
            </div>

            {/* <span className="tp-ai-date">
              Last admin-verified: 01 Mar 2026
            </span> */}

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

  {intelligence?.verification_flags?.map((flag, index) => (
    <div
      className="tp-verification-item"
      key={index}
    >
      <div
        className={`tp-verification-icon ${
          flag.status === "verified"
            ? "success"
            : "warning"
        }`}
      >
        {flag.status === "verified" ? "✓" : "!"}
      </div>

      <div className="tp-verification-content">
        <h4>{flag.title}</h4>

        <p>{flag.description}</p>
      </div>
    </div>
  ))}

</div>
  </div>

  {/* RIGHT CARD */}
  <div className="tp-supplier-analysis-card">

    <div className="tp-supplier-analysis-label">
      • RELIABILITY SCORE BREAKDOWN
    </div>

    <div className="tp-score-breakdown-list">

  {[
    {
      label: "Verification Completeness",
      value:
        intelligence?.reliability_breakdown
          ?.verificationCompleteness,
    },

    {
      label: "Activity Level",
      value:
        intelligence?.reliability_breakdown
          ?.activityLevel,
    },

    {
      label: "Flag Count Score",
      value:
        intelligence?.reliability_breakdown
          ?.flagCountScore,
    },

    {
      label: "Supplier Confidence",
      value:
        intelligence?.reliability_breakdown
          ?.supplierConfidence,
    },
  ].map((item, index) => (
    <div
      className="tp-score-breakdown-item"
      key={index}
    >
      <div className="tp-score-breakdown-top">
        <span>{item.label}</span>

        <span
          className={`tp-score-value ${
            item.value >= 80
              ? "success"
              : item.value >= 50
              ? "warning"
              : "danger"
          }`}
        >
          {item.value || 0}/100
        </span>
      </div>

      <div className="tp-score-progress">
        <div
          className={`tp-score-progress-fill ${
            item.value >= 80
              ? "success"
              : item.value >= 50
              ? "warning"
              : "danger"
          }`}
          style={{
            width: `${item.value || 0}%`,
          }}
        />
      </div>
    </div>
  ))}

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
     {exportHistory?.map((item, index) => (
  <div
    className="tp-product-history-row"
    key={index}
  >
    <span className="tp-font-data">
      {item?.hs_code || "-"}
    </span>

    <strong>
      {item?.product || "-"}
    </strong>

    <span className="tp-font-data">
      {item?.estimated_volume_tons || 0} t
    </span>

    <span className="tp-font-data">
      Active
    </span>

    <span className="tp-font-data">
      {item?.price_range || "-"}
    </span>
  </div>
))}

{exportHistory?.length === 0 && (
  <div className="tp-product-history-row">
    <span>No export history found</span>
  </div>
)}

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
       <span>Expiry Status</span>
        <span>Last Shipment</span>
        <span>Avg Lead Time</span>

      </div>

      {/* RIGHT */}
      <div className="tp-key-facts-column value">

  <span className="tp-font-data">
    {keyFacts?.registration_number || "N/A"}
  </span>

  <span className="tp-font-data">
    {keyFacts?.country || "-"}
  </span>

  <span className="tp-font-data">
    {keyFacts?.export_products?.join(", ") || "-"}
  </span>

  <span className="tp-font-data">
    {keyFacts?.certifications || "-"}
  </span>

  <span className="tp-font-data">
    N/A
  </span>

  <span className="tp-font-data">
    {keyFacts?.last_shipment || "-"}
  </span>

  <span className="tp-font-data">
    {keyFacts?.avg_lead_time || "-"}
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