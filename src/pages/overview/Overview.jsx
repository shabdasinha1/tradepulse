import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetCookie } from "../../utils/CookieManager.jsx";
import { FiSliders } from "react-icons/fi";

import CustomsDutyRates from "../../components/overview/CustomsDutyRates.jsx";
import LatestTradeNews from "../../components/overview/LatestTradeNews.jsx";
import MarketOverview from "../../components/overview/MarketOverview.jsx";
import OverviewCharts from "../../components/overview/OverviewCharts.jsx";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";

function Overview() {
  const corridorId = useSelector((state) => state.corridor.corridorId);

  const [displayName, setDisplayName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  /* ===============================
     MARGIN STATE + CALCULATION
  ============================== */

  const [budget, setBudget] = useState(250000);
  const fxPercent = 1.2; // dummy static for now

  const impact = (budget * fxPercent) / 100;

  let severity = "Low";
  let severityClass = "tp-pill-success";

  if (Math.abs(fxPercent) >= 1 && Math.abs(fxPercent) < 2) {
    severity = "Medium";
    severityClass = "tp-pill-warning";
  }

  if (Math.abs(fxPercent) >= 2) {
    severity = "High";
    severityClass = "tp-text-down";
  }

  /* ===============================
     USER NAME
  ============================== */

  useEffect(() => {
    const first = GetCookie("tp_user_first_name");
    const last = GetCookie("tp_user_last_name");

    if (first || last) {
      setDisplayName(`${first || ""} ${last || ""}`.trim());
    }
  }, []);

  return (
    <>
      {/* ===============================
          HEADER
      ============================== */}
      <section className="tp-name-section">
        <div className="tp-dashboard-container tp-grid-stack">
          <header>
            <h1 className="tp-section-title tp-overview-hero-title">
              Welcome, <span>{displayName || "User"}</span>
            </h1>

            <div className="tp-overview-sub-row">
              <p className="tp-section-sub">
                Here’s your corridor-specific trade intelligence overview.
              </p>

              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setFilterOpen(true)}
              >
                <FiSliders />
                Filters
              </button>
            </div>
          </header>
          <PageDisclaimer/>
        </div>
      </section>

      {/* ===============================
          KPI + CHARTS
      ============================== */}
      <OverviewCharts corridorId={corridorId} />

      {/* ===============================
          NEWS + MARGIN 50/50
      ============================== */}
      <section className="tp-section">
        <div className="tp-dashboard-container">

          <div className="tp-news-margin-layout">

            {/* LEFT 50% – NEWS */}
            <div className="tp-news-column">
              <LatestTradeNews corridorId={corridorId} />
            </div>

            {/* RIGHT 50% – MARGIN */}
            <div className="tp-margin-column">

              <div className="tp-card tp-margin-estimator">

                <div className="tp-margin-header">
                  <div>
                    <h3 className="tp-margin-title">
                      Margin Impact Estimator
                    </h3>
                    <p className="tp-muted">
                      Estimate FX impact on your import exposure
                    </p>
                  </div>

                  <span className="tp-badge tp-badge-primary">
                    Simple MVP
                  </span>
                </div>

                <div className="tp-margin-content">

                  <div className="tp-form-group tp-margin-input">
                    <label>Estimated Import Budget (£)</label>
                    <input
                      type="number"
                      className="tp-input"
                      value={budget}
                      onChange={(e) =>
                        setBudget(Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="tp-margin-result">
                    <p className="tp-muted">
                      Estimated FX Impact
                    </p>

                    <h2 className="tp-margin-value">
                      {impact >= 0 ? "+" : "-"}£
                      {Math.abs(impact).toLocaleString()}
                    </h2>

                    <span className={`tp-pill ${severityClass}`}>
                      {severity} Risk
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ===============================
          OTHER COMPONENTS
      ============================== */}
      <MarketOverview corridorId={corridorId} />
      <CustomsDutyRates corridorId={corridorId} />

      {filterOpen && (
        <GlobalFilterPanel
          onClose={() => setFilterOpen(false)}
        />
      )}
    </>
  );
}

export default Overview;