import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import TPChart from "../../components/common/TPChart";

const ProductDetailPage = ({ product, onBack }) => {
    const historicalPriceData = [
  { year: "2021", price: 1000 },
  { year: "2022", price: 1280 },
  { year: "2023", price: 1450 },
  { year: "2024", price: 1880 },
  { year: "2025", price: 2200 },
];

const importDemandData = [
  { month: "May 25", demand: 40 },
  { month: "Jun", demand: 44 },
  { month: "Jul", demand: 47 },
  { month: "Aug", demand: 49 },
  { month: "Sep", demand: 52 },
  { month: "Oct", demand: 56 },
  { month: "Nov", demand: 60 },
  { month: "Dec", demand: 65 },
  { month: "Jan 26", demand: 70 },
  { month: "Feb", demand: 74 },
  { month: "Mar", demand: 78 },
  { month: "Apr 26", demand: 82 },
];
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">

        {/* Header */}
        <div className="tp-product-detail-header">

          <button
            className="tp-btn-outline"
            onClick={onBack}
          >
            <FiArrowLeft />
            Back
          </button>

          <div>
            <h1 className="tp-section-title">
              Product <span>Details</span>
            </h1>

            <p className="tp-section-sub">
              {product?.categoryHs2} - {product?.productCategory}
            </p>
          </div>
        </div>

       {/* ======================================
   PRODUCT HERO SECTION
====================================== */}

<div className="tp-product-hero">

  <div className="tp-product-hero-top">

    <div className="tp-product-hero-filters">

      <input
        type="text"
        placeholder="Search HS code or product name"
        className="tp-input tp-product-search"
      />

      <select className="tp-input tp-select tp-product-filter">
        <option>Agriculture</option>
      </select>

      <select className="tp-input tp-select tp-product-filter">
        <option>Sort: Demand ↓</option>
      </select>

    </div>

    <div className="tp-product-hero-actions">

      <button className="tp-btn-outline">
        Watchlist
      </button>

      <button className="tp-btn-outline">
        Export Report
      </button>

      <button className="tp-product-ai-btn">
        Ask AI
      </button>

    </div>

  </div>


  <div className="tp-product-heading-wrap">

    <div className="tp-product-heading-row">

      <h2 className="tp-product-title">
        COCOA BEANS
      </h2>

      <span className="tp-product-hs">
        HS 1801
      </span>

      <span className="tp-product-risk">
        MED VOLATILITY
      </span>

    </div>

   
    <div className="tp-product-price-wrap">

      <h1 className="tp-product-price">
        £2,847
      </h1>

      <span className="tp-product-unit">
        /tonne
      </span>

    </div>

   
    <div className="tp-product-trends">

      <div className="tp-product-trend tp-product-trend-up">
        7d ↑ +2.1%
      </div>

      <div className="tp-product-trend tp-product-trend-up">
        30d ↑ +4.8%
      </div>

      <div className="tp-product-trend tp-product-trend-up">
        YoY ↑ +18.3%
      </div>

    </div>

  </div>


  <div className="tp-product-ai-summary">

    <div className="tp-product-ai-header">
      • AI PRODUCT INTELLIGENCE SUMMARY
    </div>

    <p className="tp-product-ai-text">
      Cocoa prices on the UK-Nigeria corridor have risen
      <strong> 18.3% over the past year</strong>, well above the
      10-year average annual appreciation of 8.4%.
      The current price of £2,847/tonne sits in the
      <strong> top 22% of its 10-year range.</strong>
      Consider accelerating orders before Q3 or negotiating
      forward contracts now.
    </p>

    <div className="tp-product-ai-footer">
      <span className="tp-product-ai-dot" />

      <span>
        Source: UN Comtrade 2016–2026 · 847 trade records
      </span>
    </div>

  </div>

</div>

{/* ======================================
   HISTORICAL PRICE TREND
====================================== */}

<div className="tp-product-chart-section">

  <div className="tp-product-chart-label">
    • HISTORICAL PRICE TREND
  </div>

  <div className="tp-product-chart-card">

    <div className="tp-product-chart-topbar">

      <p className="tp-product-chart-subtitle">
        Cocoa · UK-Nigeria · Export Price (£/tonne)
      </p>

      <div className="tp-product-chart-tabs">

        <button className="tp-product-chart-tab">
          1yr
        </button>

        <button className="tp-product-chart-tab">
          3yr
        </button>

        <button className="tp-product-chart-tab active">
          5yr
        </button>

        <button className="tp-product-chart-tab">
          10yr
        </button>

      </div>

    </div>

    <div className="tp-product-chart-price">
      £2,847 ← current
    </div>

    <TPChart
      title=""
      type="line"
      data={historicalPriceData}
      xKey="year"
      series={[
        {
          key: "price",
          label: "Export Price",
        },
      ]}
    />

  </div>

</div>

{/* ======================================
   IMPORT DEMAND TREND
====================================== */}

<div className="tp-product-chart-section">

  <div className="tp-product-chart-label">
    • IMPORT DEMAND TREND — ROLLING 12 MONTHS
  </div>

  <div className="tp-product-chart-card">

    <p className="tp-product-chart-subtitle">
      UK Import Demand · Cocoa · Monthly Volume Index
    </p>

    <TPChart
      title=""
      type="area"
      data={importDemandData}
      xKey="month"
      series={[
        {
          key: "demand",
          label: "Demand Index",
        },
      ]}
    />

  </div>

</div>

{/* ======================================
   TOP SUPPLYING COUNTRIES
====================================== */}

<div className="tp-product-detail-section">

  <div className="tp-product-chart-label">
    • TOP SUPPLYING COUNTRIES
  </div>

  <div className="tp-product-supply-table">

    {/* Header */}
    <div className="tp-product-supply-head">

      <span>COUNTRY</span>
      <span>TRADE VOLUME</span>
      <span>AVG PRICE</span>
      <span>TREND</span>
      <span>RELIABILITY</span>

    </div>

    {/* Rows */}

    <div className="tp-product-supply-row">

      <span className="tp-product-country">
        Nigeria
      </span>

      <span className="tp-font-data">
        1,847 t
      </span>

      <span className="tp-font-data tp-muted">
        £2,847/t
      </span>

      <span className="tp-text-up tp-font-data">
        ↑ +18.3%
      </span>

      <span>
        <span className="tp-pill tp-pill-success">
          HIGH
        </span>
      </span>

    </div>

    <div className="tp-product-supply-row">

      <span className="tp-product-country">
        Ghana
      </span>

      <span className="tp-font-data">
        920 t
      </span>

      <span className="tp-font-data tp-muted">
        £2,810/t
      </span>

      <span className="tp-text-up tp-font-data">
        ↑ +14.1%
      </span>

      <span>
        <span className="tp-pill tp-pill-success">
          HIGH
        </span>
      </span>

    </div>

    <div className="tp-product-supply-row">

      <span className="tp-product-country">
        Ivory Coast
      </span>

      <span className="tp-font-data">
        640 t
      </span>

      <span className="tp-font-data tp-muted">
        £2,790/t
      </span>

      <span className="tp-font-data tp-product-warning">
        ↑ +7.2%
      </span>

      <span>
        <span className="tp-pill tp-pill-warning">
          MEDIUM
        </span>
      </span>

    </div>

  </div>

</div>

{/* ======================================
   RELATED NEWS
====================================== */}

<div className="tp-product-detail-section">

  <div className="tp-product-chart-label">
    • RELATED NEWS
  </div>

  <div className="tp-product-news-list">

    {/* News Item */}
    <div className="tp-product-news-card">

      <div>
        <h4 className="tp-product-news-title">
          Ivory Coast harvest downgrade projected —
          sustained cocoa price pressure through H2 2026
        </h4>

        <p className="tp-product-news-meta">
          World Bank Commodities · Yesterday
        </p>
      </div>

      <span className="tp-product-news-badge tp-product-news-impact">
        PRICE IMPACT
      </span>

    </div>

    {/* News Item */}
    <div className="tp-product-news-card">

      <div>
        <h4 className="tp-product-news-title">
          Ghana government announces export incentive programme —
          new supply competition for UK buyers
        </h4>

        <p className="tp-product-news-meta">
          Ghana Trade Authority · 2 days ago
        </p>
      </div>

      <span className="tp-product-news-badge tp-product-news-opportunity">
        OPPORTUNITY
      </span>

    </div>

    {/* News Item */}
    <div className="tp-product-news-card">

      <div>
        <h4 className="tp-product-news-title">
          Nigerian cocoa farmers report improved yields in Ondo State —
          potential supply increase Q3
        </h4>

        <p className="tp-product-news-meta">
          Nigeria Agricultural Agency · 4 days ago
        </p>
      </div>

      <span className="tp-product-news-badge tp-product-news-context">
        CONTEXT
      </span>

    </div>

  </div>

</div>

{/* ======================================
   RELATED SUPPLIERS
====================================== */}

<div className="tp-product-detail-section">

  <div className="tp-product-chart-label">
    • RELATED SUPPLIERS
  </div>

  <div className="tp-product-supplier-list">

    <div className="tp-product-supplier-card">
      <span className="tp-product-supplier-score">
        82
      </span>

      <span>
        Adunola Farms Ltd · Nigeria
      </span>
    </div>

    <div className="tp-product-supplier-card">
      <span className="tp-product-supplier-score">
        91
      </span>

      <span>
        Ghana Cocoa Board Export · Ghana
      </span>
    </div>

    <div className="tp-product-supplier-card">
      <span className="tp-product-supplier-score tp-product-supplier-score-warning">
        67
      </span>

      <span>
        Senegal Groundnut Co. · Senegal
      </span>
    </div>

  </div>

</div>

{/* ======================================
   FOOTER INFO
====================================== */}

<div className="tp-product-footer-bar">

  <span className="tp-product-ai-dot" />

  <span>
    UN Comtrade 2016–2026 · 847 trade records ·
    Last updated: 04 Apr 2026
  </span>

</div>

      </div>
    </section>
  );
};

export default ProductDetailPage;