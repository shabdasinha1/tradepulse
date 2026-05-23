import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useSelector, shallowEqual } from "react-redux";



import {
  DashboardProductOverview,
  DashboardCorridorNews,
  DashboardAllProductList,
} from "../../services/DashboardService";

import {
  getRecentProducts,
  initializeRecentProducts
} from "../../utils/recentProducts";

import { queryKeys } from "../../utils/queryKeys";
import EmptyState from "../../components/common/EmptyState";

function NewOverview() {
  const navigate = useNavigate();


   const {
  reporterCode,
  partnerCode,
  productId,
  corridor,
  startDate,
  endDate,
  countryCode,
  partnerCountryCode,
} = useSelector((state) => state.corridor, shallowEqual);

const [recentProducts, setRecentProducts] = useState([]);

    const globalParams = useMemo(
    () => ({
      reporter: reporterCode,
      partner: partnerCode,
      product: productId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [reporterCode, partnerCode, productId, startDate, endDate],
  );

    const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: queryKeys.productOverview(globalParams),

    queryFn: () => DashboardProductOverview(globalParams),

    enabled: !!partnerCode,

    staleTime: 1000 * 60 * 5,
  });

  

    const overview = overviewData?.data || {};

      const {
    data: newsData,
    isLoading: newsLoading,
  } = useInfiniteQuery({
    queryKey: [
      "corridorNewsPreview",
      countryCode,
      partnerCountryCode,
    ],

    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        importer: countryCode,
        exporter: partnerCountryCode,
        page: pageParam,
        size: 5,
      };

      const res = await DashboardCorridorNews(params);

      return {
        country: res?.countryNews,
        corridor: res?.corridorNews,
      };
    },

    enabled: !!countryCode && !!partnerCountryCode,

    getNextPageParam: () => undefined,
  });

    const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });


      const news = useMemo(() => {
    if (!newsData?.pages) return [];

    const merged = [];

    newsData.pages.forEach((page) => {
      const countryList = page?.country?.content || [];
      const corridorList = page?.corridor?.content || [];

      const maxLength = Math.max(
        countryList.length,
        corridorList.length,
      );

      for (let i = 0; i < maxLength; i++) {
        if (countryList[i]) merged.push(countryList[i]);
        if (corridorList[i]) merged.push(corridorList[i]);
      }
    });

    return merged.slice(0, 5);
  }, [newsData]);
  const metricCards = [
    {
      label: "ACTIVE PRODUCTS",
      value: overview?.activeProducts || "--",
      sub: `In ${corridor || "Selected"} corridor`,
      variant: "primary",
    },

    {
      label: "FASTEST GROWING DEMAND",
      value:
        overview?.fastestGrowingProduct?.split(",")[0] || "--",

      sub:
        overview?.fastestGrowingProduct?.split(",")[1] || "No HS Code",

      badge: "DEMAND",

      variant: "warning",
    },

    {
      label: "HIGHEST PRICE VOLATILITY",

      value:
        overview?.topValueProduct?.split(",")[0] || "--",

      sub:
        overview?.topValueProduct?.split(",")[1] || "No HS Code",

      badge: "HIGH VOL",

      variant: "gold",
    },

    {
      label: "HIGHEST RISK FLAG",

      value:
        overview?.lowestValueProduct?.split(",")[0] || "--",

      sub:
        overview?.lowestValueProduct?.split(",")[1] || "No HS Code",

      badge: "RISK",

      variant: "danger",
    },
  ];

  const { data: initialProductsData } = useQuery({
  queryKey: [
    "initialRecentProducts",
    reporterCode,
    partnerCode,
  ],

  queryFn: async () => {
    const res = await DashboardAllProductList({
      reporter: reporterCode,
      partner: partnerCode,
      limit: 3,
      page: 1,
    });

    return res?.data?.data || [];
  },

  enabled: !!reporterCode && !!partnerCode,

  staleTime: 1000 * 60 * 10,
});

useEffect(() => {
  if (!initialProductsData?.length) return;

  const formattedProducts = initialProductsData.map(
    (item) => ({
      productCategory: item.productCategory,
      categoryHs2: item.categoryHs2,
      avgExportPrice: item.avgExportPrice,
      volatilityRisk: item.volatilityRisk,
      importDemandTrend: item.importDemandTrend,
      exportActivityLevel: item.exportActivityLevel,
      selectedHsCode: item.hsCode,
    })
  );

  initializeRecentProducts(formattedProducts);

  const recent = getRecentProducts();

  setRecentProducts(recent);
}, [initialProductsData]);
  useEffect(() => {
  const recent = getRecentProducts();
  setRecentProducts(recent);
}, []);

  return (
    <section className="tp-section">

      <div className="tp-dashboard-container tp-grid-stack">

        {/* LABEL */}
        <div className="tp-overview-metric-label">
          • KEY SIGNAL METRICS
        </div>

        {/* GRID */}
        <div className="tp-overview-metric-grid">

          {overviewLoading ? (
  [...Array(4)].map((_, index) => (
    <div
      key={index}
      className="tp-overview-metric-card primary"
    >
      <div className="tp-overview-metric-top">
        <div className="tp-overview-metric-heading">
          Loading...
        </div>
      </div>

      <div className="tp-overview-metric-value">
        --
      </div>

      <div className="tp-overview-metric-bottom">
        <span className="tp-overview-metric-sub">
          Fetching data
        </span>
      </div>
    </div>
  ))
) : (
  metricCards.map((item, index) => (
            <div
              key={index}
              className={`tp-overview-metric-card ${item.variant}`}
            >

              {/* TOP */}
              <div className="tp-overview-metric-top">

                <div className="tp-overview-metric-heading">
                  {item.label}
                </div>

              </div>

              {/* VALUE */}
             <div className="tp-overview-metric-value">
  {item.value || <EmptyState message="No Data" />}
</div>

              {/* BOTTOM */}
              <div className="tp-overview-metric-bottom">

                <span className="tp-overview-metric-sub">
                  {item.sub}
                </span>

                {item.badge && (
                  <span className="tp-overview-metric-badge">
                    {item.badge}
                  </span>
                )}

              </div>

            </div>
         ))
)}

        </div>

        {/* =========================================
    CORRIDOR NEWS INTELLIGENCE
========================================= */}

<div className="tp-corridor-news-section">

  {/* HEADER */}
  <div className="tp-corridor-news-header">

    <div className="tp-overview-metric-label">
      • CORRIDOR NEWS INTELLIGENCE
    </div>

 <button
  className="tp-btn-outline tp-corridor-news-view-btn"
  onClick={() => navigate("/trade-news")}
>
  View all
</button>

  </div>

  {/* LIST */}
 <div className="tp-corridor-news-list">

  {newsLoading ? (
    [...Array(5)].map((_, index) => (
      <div
        key={index}
        className="tp-corridor-news-card"
      >
        <div className="tp-corridor-news-content">
          <h3>Loading news...</h3>
          <p>Please wait</p>
        </div>
      </div>
    ))
  ) : news.length === 0 ? (

    <EmptyState message="No corridor news found" />

  ) : (

    news.map((item, index) => (
      <div
        key={index}
        className="tp-corridor-news-card"
      >

        <div className="tp-corridor-news-content">

          <h3>
            {item.title}
          </h3>

          <p>
            {item.source} · {formatDate(item.publishedAt)}
          </p>

        </div>

        <div
          className={`tp-corridor-news-tag ${
            item.alertType === "RISK_ALERT"
              ? "warning"
              : item.alertType === "OPPORTUNITY"
                ? "success"
                : "primary"
          }`}
        >
          {(item.alertType || "CONTEXT")
            .replaceAll("_", " ")}
        </div>

      </div>
    ))
  )}

</div>

</div>

{/* =========================================
    RECENTLY VIEWED
========================================= */}

<div className="tp-overview-section">

  {/* HEADER */}
  <div className="tp-overview-section-header">

    <div className="tp-overview-metric-label">
      • RECENTLY VIEWED
    </div>

  </div>

  {/* GRID */}
  <div className="tp-overview-card-grid">

    {recentProducts.length === 0 ? (
  <EmptyState message="No recently viewed products" />
) : (
  recentProducts.map((item, index) => (
    <div
      key={index}
      className="tp-overview-mini-card"
    >
      <div className="tp-overview-mini-top">
        <div>
          <h3 className="tp-overview-mini-title">
            {item.productCategory}
          </h3>

          <span className="tp-overview-mini-meta">
            {item.selectedHsCode}
          </span>
        </div>
      </div>

      <div className="tp-overview-mini-main">
        <div>
          <div className="tp-overview-mini-price">
            £{Number(item.avgExportPrice || 0).toLocaleString()}
            <span>/t</span>
          </div>

          <div
            className={`tp-overview-mini-change ${
              item.volatilityRisk === "HIGH"
                ? "down"
                : "up"
            }`}
          >
            {item.importDemandTrend}
          </div>
        </div>

        <svg
          className="tp-overview-mini-chart"
          viewBox="0 0 120 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 42 L18 34 L32 37 L48 28 L68 20 L86 21 L104 15 L120 10"
            className={`tp-overview-line ${
              item.volatilityRisk === "HIGH"
                ? "down"
                : "up"
            }`}
          />
        </svg>
      </div>
    </div>
  ))
)}

  </div>

</div>

{/* =========================================
    WATCHLIST SNAPSHOT
========================================= */}

<div className="tp-overview-section">

  {/* HEADER */}
  <div className="tp-overview-section-header">

    <div className="tp-overview-metric-label">
      • WATCHLIST SNAPSHOT
    </div>

    <button className="tp-btn-outline tp-watchlist-btn">
      Manage →
    </button>

  </div>

  {/* GRID */}
  <div className="tp-overview-card-grid">

    {/* CARD */}
    <div className="tp-overview-mini-card">

      <div className="tp-overview-mini-top">

        <h3 className="tp-overview-mini-title">
          Cocoa
        </h3>

        <div className="tp-overview-status-tag warning">
          HIGH VOL
        </div>

      </div>

      <div className="tp-overview-mini-main">

        <div>

          <div className="tp-overview-mini-price">
            £2,847
            <span>/t</span>
          </div>

          <div className="tp-overview-mini-change up">
            ↑ +2.1% 7d
          </div>

        </div>

        <svg
          className="tp-overview-mini-chart"
          viewBox="0 0 120 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 42 L18 34 L32 37 L48 28 L68 20 L86 21 L104 15 L120 10"
            className="tp-overview-line up"
          />
        </svg>

      </div>

    </div>

    {/* CARD */}
    <div className="tp-overview-mini-card">

      <div className="tp-overview-mini-top">

        <h3 className="tp-overview-mini-title">
          Sesame
        </h3>

        <div className="tp-overview-status-tag success">
          LOW VOL
        </div>

      </div>

      <div className="tp-overview-mini-main">

        <div>

          <div className="tp-overview-mini-price">
            £1,240
            <span>/t</span>
          </div>

          <div className="tp-overview-mini-change down">
            ↓ -6.0% 7d
          </div>

        </div>

        <svg
          className="tp-overview-mini-chart"
          viewBox="0 0 120 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 L18 16 L32 14 L48 20 L68 24 L86 31 L104 36 L120 38"
            className="tp-overview-line down"
          />
        </svg>

      </div>

    </div>

    {/* CARD */}
    <div className="tp-overview-mini-card">

      <div className="tp-overview-mini-top">

        <h3 className="tp-overview-mini-title">
          Palm Oil
        </h3>

        <div className="tp-overview-status-tag danger">
          FLAGGED
        </div>

      </div>

      <div className="tp-overview-mini-main">

        <div>

          <div className="tp-overview-mini-price">
            £890
            <span>/t</span>
          </div>

          <div className="tp-overview-mini-change up">
            ↑ +0.8% 7d
          </div>

        </div>

        <svg
          className="tp-overview-mini-chart"
          viewBox="0 0 120 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 34 L18 32 L32 35 L48 31 L68 28 L86 29 L104 27 L120 26"
            className="tp-overview-line success"
          />
        </svg>

      </div>

    </div>

  </div>

</div>

{/* =========================================
    DATA SOURCES
========================================= */}

{/* <div className="tp-overview-source-bar">

  <span className="tp-overview-source-dot"></span>

  <span>
    UN Comtrade · 04 Apr 2026 06:14 UTC
  </span>

  <span>|</span>

  <span>
    World Bank · 04 Apr 2026 00:00 UTC
  </span>

  <span>|</span>

  <span>
    Freightos · 03 Apr 2026 22:30 UTC
  </span>

  <span>|</span>

  <span>
    FX · 04 Apr 2026 07:01 UTC
  </span>

</div> */}

      </div>

    </section>
  );
}

export default NewOverview;