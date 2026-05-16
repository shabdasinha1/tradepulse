import React from "react";

function NewOverview() {

  const metricCards = [
    {
      label: "ACTIVE PRODUCTS",
      value: "24",
      sub: "In UK ↔ Nigeria corridor",
      variant: "primary",
    },

    {
      label: "FASTEST GROWING DEMAND",
      value: "SESAME",
      sub: "HS 1207",
      badge: "+18% YOY",
      variant: "warning",
    },

    {
      label: "HIGHEST PRICE VOLATILITY",
      value: "COCOA",
      sub: "HS 1801",
      badge: "HIGH VOL",
      variant: "gold",
    },

    {
      label: "HIGHEST RISK FLAG",
      value: "PALM OIL",
      sub: "HS 1511",
      badge: "2 FLAGS",
      variant: "danger",
    },
  ];

  return (
    <section className="tp-section">

      <div className="tp-dashboard-container tp-grid-stack">

        {/* LABEL */}
        <div className="tp-overview-metric-label">
          • KEY SIGNAL METRICS
        </div>

        {/* GRID */}
        <div className="tp-overview-metric-grid">

          {metricCards.map((item, index) => (
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
                {item.value}
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
          ))}

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

    <button className="tp-btn-outline tp-corridor-news-view-btn">
      View all
    </button>

  </div>

  {/* LIST */}
  <div className="tp-corridor-news-list">

    {/* CARD */}
    <div className="tp-corridor-news-card">

      <div className="tp-corridor-news-content">

        <h3>
          Nigerian port congestion alerts at Apapa —
          estimated 2–3 week shipment delays
        </h3>

        <p>
          Reuters Africa · 2 hrs ago
        </p>

      </div>

      <div className="tp-corridor-news-tag warning">
        RISK ALERT
      </div>

    </div>

    {/* CARD */}
    <div className="tp-corridor-news-card">

      <div className="tp-corridor-news-content">

        <h3>
          Sesame prices down 6% WoW —
          current price in lowest 20% of 5-year range
        </h3>

        <p>
          UN Comtrade · Today
        </p>

      </div>

      <div className="tp-corridor-news-tag success">
        OPPORTUNITY
      </div>

    </div>

    {/* CARD */}
    <div className="tp-corridor-news-card">

      <div className="tp-corridor-news-content">

        <h3>
          Ivory Coast harvest downgrade projected —
          sustained cocoa price pressure through H2 2026
        </h3>

        <p>
          World Bank Commodities · Yesterday
        </p>

      </div>

      <div className="tp-corridor-news-tag primary">
        PRICE IMPACT
      </div>

    </div>

    {/* CARD */}
    <div className="tp-corridor-news-card">

      <div className="tp-corridor-news-content">

        <h3>
          Ghana government announces export incentive
          programme for cocoa farmers —
          new supply competition
        </h3>

        <p>
          Ghana Trade Authority · 2 days ago
        </p>

      </div>

      <div className="tp-corridor-news-tag success">
        OPPORTUNITY
      </div>

    </div>

    {/* CARD */}
    <div className="tp-corridor-news-card">

      <div className="tp-corridor-news-content">

        <h3>
          AfCFTA Phase 2 implementation update —
          new preferential tariff schedules published
        </h3>

        <p>
          WTO Tariff API · 3 days ago
        </p>

      </div>

      <div className="tp-corridor-news-tag primary">
        CONTEXT
      </div>

    </div>

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

    {/* CARD */}
    <div className="tp-overview-mini-card">

      <div className="tp-overview-mini-top">

        <div>

          <h3 className="tp-overview-mini-title">
            Cocoa Beans
          </h3>

          <span className="tp-overview-mini-meta">
            HS 1801
          </span>

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

        <div>

          <h3 className="tp-overview-mini-title">
            Adunola Farms
          </h3>

        </div>

        <div className="tp-overview-status-tag warning">
          PARTIAL
        </div>

      </div>

      <div className="tp-overview-mini-main">

        <div>

          <div className="tp-overview-mini-score">
            82
            <span>/100</span>
          </div>

          <div className="tp-overview-mini-alert">
            NAFDAC expiry 43d
          </div>

        </div>

        <div className="tp-overview-status-tag success">
          VERIFIED
        </div>

      </div>

    </div>

    {/* CARD */}
    <div className="tp-overview-mini-card">

      <div className="tp-overview-mini-top">

        <div>

          <h3 className="tp-overview-mini-title">
            Sesame Seeds
          </h3>

          <span className="tp-overview-mini-meta">
            HS 1207
          </span>

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

<div className="tp-overview-source-bar">

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

</div>

      </div>

    </section>
  );
}

export default NewOverview;