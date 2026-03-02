import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetCookie } from "../../utils/CookieManager.jsx";
import { FiSliders } from "react-icons/fi";

import CustomsDutyRates from '../../components/overview/CustomsDutyRates.jsx';
import LatestTradeNews from '../../components/overview/LatestTradeNews.jsx';
import MarketOverview from '../../components/overview/MarketOverview.jsx';
import OverviewCharts from '../../components/overview/OverviewCharts.jsx';
import GlobalFilterPanel from '../../components/global/GlobalFilterPanel.jsx'; // ✅ added

function Overview() {

  const corridorId = useSelector((state) => state.corridor.corridorId);

  const [displayName, setDisplayName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false); // ✅ added

  useEffect(() => {
    const first = GetCookie("tp_user_first_name");
    const last = GetCookie("tp_user_last_name");

    if (first || last) {
      setDisplayName(`${first || ""} ${last || ""}`.trim());
    }
  }, []);

  return (
    <>
      <section className="tp-name-section">
        <div className="tp-dashboard-container tp-grid-stack">

          {/* HEADER */}
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

        </div>
      </section>

      {/* EXISTING COMPONENTS */}
      <OverviewCharts corridorId={corridorId} />
      <LatestTradeNews corridorId={corridorId} />
      <MarketOverview corridorId={corridorId} />
      <CustomsDutyRates corridorId={corridorId} />

      {/* ✅ FILTER PANEL */}
      {filterOpen && (
        <GlobalFilterPanel onClose={() => setFilterOpen(false)} />
      )}
    </>
  );
}

export default Overview;