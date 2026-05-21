import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector, shallowEqual } from "react-redux";

import TPChart from "../../components/common/TPChart";

import {
  DashboardExportPriceTrend,
  DashboardImportDemandTrend,
  DashboardCompanySuppliers,
  DashboardSuppliers
} from "../../services/DashboardService";

import { queryKeys } from "../../utils/queryKeys";

const ProductDetailPage = ({ product, onBack }) => {

  const {
  reporterCode,
  partnerCode,
  corridor,
  currencySymbol,
  partnerCountryCode,
  partnerRegion,
  region

} = useSelector(
  (state) => state.corridor,
  shallowEqual,
);

const currency = currencySymbol || "£";

  const productName =
    product?.productCategory || "N/A";

  const hsCode =
    product?.categoryHs2 || "N/A";

    const selectedHsCode =
  product?.selectedHsCode || "";
 

  const avgPrice =
    product?.avgExportPrice || 0;

  const volatility =
    product?.volatilityRisk || "LOW";

  const demandTrend =
    product?.importDemandTrend || "N/A";

  const exportActivity =
    product?.exportActivityLevel || "N/A";


    const {
  data: exportTrendData,
  isLoading: exportTrendLoading,
} = useQuery({
  queryKey: queryKeys.productExportPriceTrend(
    reporterCode,
    partnerCode,
    hsCode,
  ),

  queryFn: () =>
    DashboardExportPriceTrend({
      reporterCode: reporterCode,
      partnerCode: partnerCode,
      hsCode: selectedHsCode,
    }),

  enabled: !!selectedHsCode,
});

const historicalTrendData =
  exportTrendData?.data?.map((item) => ({
    year: new Date(item?.date).getFullYear(),
    price: Number(item?.price || 0),
  })) || [];

  const {
  data: importDemandTrendData,
  isLoading: importDemandTrendLoading,
} = useQuery({
  queryKey: queryKeys.productImportDemandTrend(
    reporterCode,
    partnerCode,
    selectedHsCode,
  ),

  queryFn: () =>
    DashboardImportDemandTrend({
      reporterCode: reporterCode,
      partnerCode: partnerCode,
      hsCode: selectedHsCode,
    }),

  enabled: !!selectedHsCode,
});

const demandTrendChartData =
  importDemandTrendData?.data?.map((item) => ({
    month: item?.date,
    demand: Number(item?.demand || 0),
  })) || [];

  const {
  data: supplierData,
  isLoading: supplierLoading,
} = useQuery({
  queryKey: queryKeys.productSuppliers(
    partnerCode,
    selectedHsCode,
  ),

  queryFn: () =>
    DashboardCompanySuppliers({
      page: 1,
      limit: 20,
      country:  partnerCountryCode,
      hsCode: selectedHsCode,
      region: partnerRegion,
    }),

  enabled: !!selectedHsCode && !!partnerCode,
});

const suppliers =
  supplierData?.suppliers ||
  supplierData?.data?.suppliers ||
  [];

  const {
  data: topSupplyingCountriesData,
  isLoading: topSupplyingCountriesLoading,
} = useQuery({
  queryKey: queryKeys.topSupplyingCountries(
    reporterCode,
    partnerCode,
    selectedHsCode,
    "EXPORT",
    region,
  ),

  queryFn: () =>
    DashboardSuppliers({
      page: 1,
      limit: 10,
      tradeFlow: "EXPORT",
      originRegion: region,
      partnerCode,
      hsCode: selectedHsCode,
      reporterCode,
    }),

  enabled:
    !!selectedHsCode &&
    !!partnerCode &&
    !!reporterCode,
});

const topSupplyingCountries =
  topSupplyingCountriesData?.data?.suppliers || [];

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
               {productName}
              </h1>

              <span className="tp-product-hs">
            {selectedHsCode}
              </span>

              <span className="tp-product-volatility-pill">
                {volatility}
              </span>

            </div>

            {/* PRICE */}
            <div className="tp-product-price-row">

              <span className="tp-product-price tp-font-data">
  {currency}
  {Number(avgPrice).toLocaleString()}
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
          {productName} · {corridor} · Export Price
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
       data={historicalTrendData}
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
         {volatility}
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
       data={demandTrendChartData}
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

      {topSupplyingCountriesLoading ? (
  <div className="tp-product-country-row">
    <span>Loading...</span>
  </div>
) : topSupplyingCountries?.length > 0 ? (
  topSupplyingCountries.map((country, index) => (
    <div
      key={`${country?.name}-${index}`}
      className="tp-product-country-row"
    >
      <strong>
        {country?.name || "N/A"}
      </strong>

      <span className="tp-font-data">
        {Number(country?.totalTrade || 0).toLocaleString()}
      </span>

      <span className="tp-font-data">
        {currency}
        {Number(country?.avgPrice || 0).toLocaleString()} / t
      </span>

      <span
        className={`tp-product-country-trend ${
          Number(
            String(country?.trend || "0")
              .replace("%", "")
              .replace("+", ""),
          ) >= 0
            ? "positive"
            : "warning"
        }`}
      >
        {Number(
          String(country?.trend || "0")
            .replace("%", ""),
        ) >= 0
          ? "↑"
          : "↓"}{" "}
        {country?.trend || "0%"}
      </span>

      <span
        className={`tp-product-country-pill ${
          country?.reliability === "HIGH"
            ? "high"
            : country?.reliability === "MEDIUM"
            ? "medium"
            : "low"
        }`}
      >
        {country?.reliability || "LOW"}
      </span>
    </div>
  ))
) : (
  <div className="tp-product-country-row">
    <span>No supplying countries found</span>
  </div>
)}

    </div>
  </div>
</div>

{/* =========================================
    RELATED NEWS
========================================= */}

{/* <div className="tp-product-news-section">

  <div className="tp-product-section-label">
    • RELATED NEWS
  </div>

  <div className="tp-product-news-list">

   
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
</div> */}

{/* =========================================
    RELATED SUPPLIERS
========================================= */}

<div className="tp-product-related-supplier-section">

  <div className="tp-product-section-label">
    • RELATED SUPPLIERS
  </div>

  <div className="tp-product-related-supplier-list">

 {supplierLoading ? (
  <div className="tp-product-related-supplier-card">
    Loading suppliers...
  </div>
) : suppliers?.length > 0 ? (
  suppliers.map((supplier) => {
    const reliabilityScore = Math.round(
      Number(supplier?.reliability_score || 0) * 100,
    );

    return (
      <div
        key={supplier?.id}
        className="tp-product-related-supplier-card"
      >
        <div
          className={`tp-product-related-score ${
            reliabilityScore >= 80
              ? "success"
              : reliabilityScore >= 60
              ? "warning"
              : "danger"
          }`}
        >
          {reliabilityScore}
        </div>

        <span>
          {supplier?.company_name} ·{" "}
          {supplier?.country_name}
        </span>
      </div>
    );
  })
) : (
  <div className="tp-product-related-supplier-card">
    No suppliers found
  </div>
)}

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