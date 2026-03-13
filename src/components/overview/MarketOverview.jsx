import { useSelector } from "react-redux";
import { FiDollarSign, FiTruck } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";
import { useEffect, useState } from "react";
import {
  DashboardOverviewExchange,
  DashboardOverviewShipping,
   DashboardExchangeRate ,
    DashboardShippingCosts 
} from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import VerticalScroll from "../common/VerticalScroll.jsx";
import UniversalFilter from "../common/UniversalFilter"; // ✅ new
import { MdOutlineCurrencyPound } from "react-icons/md";
import { CiFilter } from "react-icons/ci";

const MarketOverview = ({ corridorId }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [fxFilterOpen, setFxFilterOpen] = useState(false); // Exchange Modal
  const [shipFilterOpen, setShipFilterOpen] = useState(false); // Shipping Modal

  const [OverviewData, setOverviewData] = useState({
    shippingData: [],
    exchangeRates: [],
  });

  const [base, setBase] = useState("EUR");

  const { baseCurrency,partnerCode, productId, startDate, endDate } = useSelector(
  (state) => state.corridor
);

  /* ===============================
     FILTER STATES (INDEPENDENT)
  =============================== */

const [fxFilters, setFxFilters] = useState({
  quoteCurrency: "",
  startDate: "",
  endDate: "",
});

  const [shipFilters, setShipFilters] = useState({
    corridor: corridorId || "",
    timeRange: "90d",
  });

  /* ===============================
     EXCHANGE FETCH
  =============================== */

/* ===============================
   EXCHANGE FETCH
================================ */

useEffect(() => {
  if (!partnerCode) return;

  const fetchExchange = async () => {
    try {

      const activeQuote = fxFilters.quoteCurrency || "";
      const activeStart = fxFilters.startDate || startDate;
      const activeEnd = fxFilters.endDate || endDate;
      
      const res = await DashboardExchangeRate({
        baseCurrency,
        quoteCurrency: activeQuote,
        startDate: activeStart,
        endDate: activeEnd,
      });

      setOverviewData((prev) => ({
        ...prev,
        exchangeRates: res?.data || [],
      }));

    } catch (err) {
      setError(GetApiErrorMessage(err));
    }
  };

  fetchExchange();
}, [
  partnerCode,
  baseCurrency,
  startDate,
  endDate,
  fxFilters
]);

  /* ===============================
     SHIPPING FETCH
  =============================== */
useEffect(() => {
  const fetchShipping = async () => {
    try {
      const res = await DashboardShippingCosts({
        page: 1,
        limit: 50,
        startDate: startDate || shipFilters.startDate,
        endDate: endDate || shipFilters.endDate,
        origin: shipFilters.origin || "",
        destination: shipFilters.destination || "",
      });

      setOverviewData((prev) => ({
        ...prev,
        shippingData: res?.data || [],
      }));
    } catch (err) {
      setError(GetApiErrorMessage(err));
    }
  };

  fetchShipping();
}, [startDate, endDate, shipFilters]);

  return (
    <section className="tp-section">
      <div className="tp-dashboard-container tp-grid-stack">
        {/* ================= EXCHANGE RATES ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header tp-card-filter-header">
              <div className="tp-card-title-wrap">
                <MdOutlineCurrencyPound />

                <h3 className="tp-card-title">
                  Corridor FX & Cost Impact Monitor
                </h3>
              </div>
              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setFxFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>

           
            </div>
          }
        >
          <div className="tp-grid tp-rates-grid">
            <VerticalScroll className="rtx-vertical-scroll">
              <div className="rtx-tp-rate-card-container">
                {OverviewData?.exchangeRates?.map((r, index) => (
                  <div key={index} className="tp-rate-card">
                    <div className="tp-rate-header">
                      <span className="tp-rate-symbol">{r.currency}</span>
                      <span
                        className={`tp-rate-change ${
                          r.trend === "UP"
                            ? "tp-text-up"
                            : r.trend === "DOWN"
                              ? "tp-text-down"
                              : "tp-text-neutral"
                        }`}
                      >
                        {r.changePercent}%
                      </span>
                    </div>

                    <span className="tp-rate-pair">{r.pair}</span>
                    <strong className="tp-rate-value">{r.rate}</strong>
                  </div>
                ))}
              </div>
            </VerticalScroll>
          </div>
        </TradePulseCard>

        {/* ================= SHIPPING COSTS ================= */}
        <TradePulseCard
          header={
            <div className="tp-card-header tp-card-filter-header">
              <div className="tp-card-title-wrap">
                <FiTruck />
                <h3 className="tp-card-title">Latest Shipping Costs</h3>
              </div>
              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setShipFilterOpen(true)}
              >
                <CiFilter />
                Filters
              </button>

            </div>
          }
        >
          <div className="tp-grid tp-ship-grid">
          {OverviewData?.shippingData?.map((s, i) => (
  <div key={i} className="tp-ship-card">
    <div className="tp-ship-header">
      <div>
        <h4 className="tp-ship-route">{s.corridor}</h4>
        <span className="tp-ship-port">{s.currency}</span>
      </div>

      <span className="tp-ship-days">
        {s.days ? `${s.days} Days` : "0 Days"}
      </span>
    </div>

    <div className="tp-ship-footer">
      <strong className="tp-ship-price">
        {s.currency} {s.cost}
      </strong>

      <span
        className={`tp-ship-change ${
          s.changePercent != 0
            ? s.changePercent > 0
              ? "tp-text-up"
              : "tp-text-down"
            : "tp-muted"
        }`}
      >
        {s.changePercent}%
      </span>
    </div>
  </div>
))}
          </div>
        </TradePulseCard>
        {/* FX Filter Modal */}
        {fxFilterOpen && (
          <UniversalFilter
           
            showTimeRange
            showQuoteCurrency
            defaultValues={fxFilters}
            onChange={(filters) => {
              setFxFilters(filters); // update FX filter state
              setFxFilterOpen(false); // close modal
            }}
          />
        )}

        {/* Shipping Filter Modal */}
        {shipFilterOpen && (
          <UniversalFilter
            showOrigin
            showDestination
            showTimeRange
            defaultValues={shipFilters}
            onChange={(filters) => {
              setShipFilters(filters); // update Shipping filter state
              setShipFilterOpen(false); // close modal
            }}
          />
        )}
        {/* {error && <div className="text-center tp-text-danger">{error}</div>} */}
      </div>
    </section>
  );
};

export default MarketOverview;
