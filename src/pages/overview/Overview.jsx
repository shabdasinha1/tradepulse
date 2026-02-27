import { useEffect, useState } from "react";
import { GetCookie } from "../../utils/CookieManager.jsx";

import CustomsDutyRates from '../../components/overview/CustomsDutyRates.jsx';
import LatestTradeNews from '../../components/overview/LatestTradeNews.jsx';
import MarketOverview from '../../components/overview/MarketOverview.jsx';
import OverviewCharts from '../../components/overview/OverviewCharts.jsx';

function Overview() {

  const [displayName, setDisplayName] = useState("");

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

        {/* HEADER (Same Pattern As Product Page) */}
        <header>
        <h1 className="tp-section-title tp-overview-hero-title">
  Welcome, <span>{displayName || "User"}</span>
</h1>
          <p className="tp-section-sub">
            Here's your trade intelligence snapshot for today
          </p>
        </header>

   
      </div>
    </section>
         {/* EXISTING COMPONENTS */}
        <OverviewCharts />
        <LatestTradeNews />
        <MarketOverview />
        <CustomsDutyRates />
        </>

  );
}

export default Overview;