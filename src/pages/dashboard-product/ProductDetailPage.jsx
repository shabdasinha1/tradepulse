import React from "react";
import TPChart from "../../components/common/TPChart";


const ProductDetailPage = ({ product, onBack }) => {
  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">

        {/* =========================================
            TOP BAR
        ========================================= */}

        <div className="tp-product-detail-topbar">

          <button
            className="tp-btn-outline"
            onClick={onBack}
          >
            ← All Products
          </button>

        </div>

        

        {/* =========================================
            HERO SECTION
        ========================================= */}

        <div className="tp-product-detail-hero">

          {/* LEFT */}
          <div className="tp-product-detail-left">

            <div className="tp-product-title-row">

              <h1 className="tp-product-detail-title">
                {product?.productCategory || "COCOA BEANS"}
              </h1>

              <span className="tp-product-hs">
                HS {product?.categoryHs2 || "1801"}
              </span>

              <span className="tp-product-volatility-pill">
                MED VOLATILITY
              </span>

            </div>

            {/* PRICE */}
            <div className="tp-product-price-row">

              <span className="tp-product-price tp-font-data">
                £2,847
              </span>

              <span className="tp-product-unit">
                /tonne
              </span>

            </div>

            {/* METRICS */}
            <div className="tp-product-growth-row">

              <div className="tp-product-growth-pill">
                7d ↑ +2.1%
              </div>

              <div className="tp-product-growth-pill">
                30d ↑ +4.8%
              </div>

              <div className="tp-product-growth-pill">
                YoY ↑ +18.3%
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="tp-product-detail-actions">

            <button className="tp-btn-outline">
              Watchlist
            </button>

            <button className="tp-btn-primary">
              Export Report
            </button>

            <button className="tp-btn-warning">
              Ask AI
            </button>

          </div>

        </div>

        {/* =========================================
    AI PRODUCT SUMMARY
========================================= */}

{/* <div className="tp-product-ai-summary-card">

  <div className="tp-product-section-label">
    • AI PRODUCT INTELLIGENCE SUMMARY
  </div>

  <p className="tp-product-ai-summary-text">

    Cocoa prices on the UK-Nigeria corridor have risen

    <strong> 18.3% over the past year</strong>,

    well above the 10-year average annual appreciation
    of 8.4%.

    The current price of £2,847/tonne sits in the

    <strong> top 22% of its 10-year range.</strong>

    Consider accelerating orders before Q3 or negotiating
    forward contracts now.

  </p>

  <div className="tp-product-ai-summary-footer">

    <div className="tp-product-ai-source">

      <span className="tp-product-ai-dot"></span>

      <span>
        Source: UN Comtrade 2016–2026 · 847 trade records
      </span>

    </div>

  </div>
</div> */}

{/* =========================================
    HISTORICAL PRICE TREND
========================================= */}

<div className="tp-product-trend-section">

  <div className="tp-product-section-label">
    • HISTORICAL PRICE TREND
  </div>

  <div className="tp-product-trend-card">

    {/* TOP */}
    <div className="tp-product-trend-top">

      <div>

        <div className="tp-product-trend-title">
          Cocoa · UK-Nigeria · Export Price
        </div>

        <div className="tp-product-trend-subtitle">
          Historical export pricing intelligence (£/tonne)
        </div>

      </div>

      <div className="tp-product-trend-filter-group">

        <button className="tp-product-trend-filter">
          1yr
        </button>

        <button className="tp-product-trend-filter">
          3yr
        </button>

        <button className="tp-product-trend-filter active">
          5yr
        </button>

        <button className="tp-product-trend-filter">
          10yr
        </button>

      </div>

    </div>

    {/* CHART */}
    <div className="tp-product-trend-chart-wrapper">

      <TPChart
        title=""
        type="line"
        xKey="year"
        data={[
          { year: "2021", price: 1480 },
          { year: "2022", price: 1710 },
          { year: "2023", price: 1940 },
          { year: "2024", price: 2210 },
          { year: "2025", price: 2590 },
          { year: "2026", price: 2847 },
        ]}
        series={[
          {
            key: "price",
            label: "Export Price",
          },
        ]}
      />

    </div>

    {/* FOOTER */}
    <div className="tp-product-trend-footer">

      <div className="tp-product-trend-stat">

        <span className="tp-product-trend-stat-label">
          CAGR
        </span>

        <span className="tp-product-trend-stat-value tp-text-up">
          +13.8%
        </span>

      </div>

      <div className="tp-product-trend-stat">

        <span className="tp-product-trend-stat-label">
          Volatility
        </span>

        <span className="tp-product-trend-stat-value">
          Medium
        </span>

      </div>

      <div className="tp-product-trend-stat">

        <span className="tp-product-trend-stat-label">
          Peak
        </span>

        <span className="tp-product-trend-stat-value">
          £2,847
        </span>

      </div>

    </div>

  </div>

</div>

{/* =========================================
    IMPORT DEMAND TREND
========================================= */}

<div className="tp-product-demand-section">

  <div className="tp-product-section-label">
    • IMPORT DEMAND TREND — ROLLING 12 MONTHS
  </div>

  <div className="tp-product-demand-card">

    {/* TOP */}
    <div className="tp-product-demand-top">

      <div>

        <div className="tp-product-demand-title">
          UK Import Demand · Cocoa
        </div>

        <div className="tp-product-demand-subtitle">
          Monthly volume demand index intelligence
        </div>

      </div>

      <div className="tp-product-demand-pill">
        +14.2% YoY
      </div>

    </div>

    {/* CHART */}
    <div className="tp-product-demand-chart-wrapper">

      <TPChart
        title=""
        type="area"
        xKey="month"
        data={[
          { month: "May", demand: 820 },
          { month: "Jun", demand: 860 },
          { month: "Jul", demand: 910 },
          { month: "Aug", demand: 980 },
          { month: "Sep", demand: 1040 },
          { month: "Oct", demand: 1130 },
          { month: "Nov", demand: 1190 },
          { month: "Dec", demand: 1280 },
          { month: "Jan", demand: 1360 },
          { month: "Feb", demand: 1490 },
          { month: "Mar", demand: 1580 },
          { month: "Apr", demand: 1670 },
        ]}
        series={[
          {
            key: "demand",
            label: "Demand Index",
          },
        ]}
      />

    </div>

    {/* FOOTER */}
    <div className="tp-product-demand-footer">

      <div className="tp-product-demand-stat">

        <span className="tp-product-demand-stat-label">
          Current Demand
        </span>

        <span className="tp-product-demand-stat-value">
          1,670
        </span>

      </div>

      <div className="tp-product-demand-stat">

        <span className="tp-product-demand-stat-label">
          Growth Trend
        </span>

        <span className="tp-product-demand-stat-value tp-text-up">
          Accelerating
        </span>

      </div>

      <div className="tp-product-demand-stat">

        <span className="tp-product-demand-stat-label">
          Market Signal
        </span>

        <span className="tp-product-demand-stat-value">
          Strong
        </span>

      </div>

    </div>

  </div>

</div>

{/* =========================================
    TOP SUPPLYING COUNTRIES
========================================= */}

<div className="tp-product-country-section">

  <div className="tp-product-section-label">
    • TOP SUPPLYING COUNTRIES
  </div>

  <div className="tp-product-country-table-wrapper">

    <div className="tp-product-country-table">

      {/* HEADER */}
      <div className="tp-product-country-head">

        <span>COUNTRY</span>
        <span>TRADE VOLUME</span>
        <span>AVG PRICE</span>
        <span>TREND</span>
        <span>RELIABILITY</span>

      </div>

      {/* ROW */}
      <div className="tp-product-country-row">

        <strong>Nigeria</strong>

        <span className="tp-font-data">
          1,847 t
        </span>

        <span className="tp-font-data">
          £2,847 / t
        </span>

        <span className="tp-product-country-trend positive">
          ↑ +18.3%
        </span>

        <span className="tp-product-country-pill high">
          HIGH
        </span>

      </div>

      {/* ROW */}
      <div className="tp-product-country-row">

        <strong>Ghana</strong>

        <span className="tp-font-data">
          920 t
        </span>

        <span className="tp-font-data">
          £2,810 / t
        </span>

        <span className="tp-product-country-trend positive">
          ↑ +14.1%
        </span>

        <span className="tp-product-country-pill high">
          HIGH
        </span>

      </div>

      {/* ROW */}
      <div className="tp-product-country-row">

        <strong>Ivory Coast</strong>

        <span className="tp-font-data">
          640 t
        </span>

        <span className="tp-font-data">
          £2,790 / t
        </span>

        <span className="tp-product-country-trend warning">
          ↑ +7.2%
        </span>

        <span className="tp-product-country-pill medium">
          MEDIUM
        </span>

      </div>

    </div>
  </div>
</div>

{/* =========================================
    RELATED NEWS
========================================= */}

<div className="tp-product-news-section">

  <div className="tp-product-section-label">
    • RELATED NEWS
  </div>

  <div className="tp-product-news-list">

    {/* NEWS CARD */}
    <div className="tp-product-news-card">

      <div className="tp-product-news-content">

        <h3>
          Ivory Coast harvest downgrade projected —
          sustained cocoa price pressure through H2 2026
        </h3>

        <p>
          World Bank Commodities · Yesterday
        </p>

      </div>

      <div className="tp-product-news-tag warning">
        PRICE IMPACT
      </div>

    </div>

    {/* NEWS CARD */}
    <div className="tp-product-news-card">

      <div className="tp-product-news-content">

        <h3>
          Ghana government announces export incentive
          programme — new supply competition for UK buyers
        </h3>

        <p>
          Ghana Trade Authority · 2 days ago
        </p>

      </div>

      <div className="tp-product-news-tag success">
        OPPORTUNITY
      </div>

    </div>

    {/* NEWS CARD */}
    <div className="tp-product-news-card">

      <div className="tp-product-news-content">

        <h3>
          Nigerian cocoa farmers report improved yields in
          Ondo State — potential supply increase Q3
        </h3>

        <p>
          Nigeria Agricultural Agency · 4 days ago
        </p>

      </div>

      <div className="tp-product-news-tag primary">
        CONTEXT
      </div>

    </div>

  </div>
</div>

{/* =========================================
    RELATED SUPPLIERS
========================================= */}

<div className="tp-product-related-supplier-section">

  <div className="tp-product-section-label">
    • RELATED SUPPLIERS
  </div>

  <div className="tp-product-related-supplier-list">

    {/* SUPPLIER */}
    <div className="tp-product-related-supplier-card">

      <div className="tp-product-related-score success">
        82
      </div>

      <span>
        Adunola Farms Ltd · Nigeria
      </span>

    </div>

    {/* SUPPLIER */}
    <div className="tp-product-related-supplier-card">

      <div className="tp-product-related-score success">
        91
      </div>

      <span>
        Ghana Cocoa Board Export · Ghana
      </span>

    </div>

    {/* SUPPLIER */}
    <div className="tp-product-related-supplier-card">

      <div className="tp-product-related-score warning">
        67
      </div>

      <span>
        Senegal Groundnut Co. · Senegal
      </span>

    </div>

  </div>
</div>

{/* =========================================
    FOOTER BAR
========================================= */}

<div className="tp-product-footer-bar">

  <div className="tp-product-footer-content">

    <span className="tp-product-footer-dot"></span>

    <span>
      UN Comtrade 2016–2026
    </span>

    <span>·</span>

    <span>
      847 trade records
    </span>

    <span>·</span>

    <span>
      Last updated: 04 Apr 2026
    </span>

  </div>

</div>

      </div>
    </section>
  );
};

export default ProductDetailPage;