import { FiDollarSign, FiTruck } from "react-icons/fi";
import TradePulseCard from "../common/TradePulseCard.jsx";
import { useEffect, useState } from "react";
import {
  DashboardOverviewExchange,
  DashboardOverviewShipping,
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

  /* ===============================
     FILTER STATES (INDEPENDENT)
  =============================== */

  const [fxFilters, setFxFilters] = useState({
    corridor: corridorId || "",
    timeRange: "90d",
  });

  const [shipFilters, setShipFilters] = useState({
    corridor: corridorId || "",
    timeRange: "90d",
  });

  /* ===============================
     EXCHANGE FETCH
  =============================== */

  useEffect(() => {
    if (!fxFilters.corridor) return;

    const fetchExchange = async () => {
      try {
        const res = await DashboardOverviewExchange({
          base,
          corridor_id: fxFilters.corridor,
          time_range: fxFilters.timeRange,
        });

        setOverviewData((prev) => ({
          ...prev,
          exchangeRates: res?.data?.data?.rates || [],
        }));
      } catch (err) {
        setError(GetApiErrorMessage(err));
      }
    };

    fetchExchange();
  }, [base, fxFilters]);

  /* ===============================
     SHIPPING FETCH
  =============================== */

  useEffect(() => {
    if (!shipFilters.corridor) return;

    const fetchShipping = async () => {
      try {
        const res = await DashboardOverviewShipping({
          corridor_id: shipFilters.corridor,
          time_range: shipFilters.timeRange,
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
  }, [shipFilters]);

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

              {/* ✅ Independent Filter */}
              {/* <UniversalFilter
                showCorridor
                showTimeRange
                defaultValues={{
                  corridor: corridorId || "",
                  timeRange: "90d",
                }}
                onChange={(filters) => {
                  setFxFilters(filters);
                }}
              /> */}
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

              {/* ✅ Independent Filter */}
              {/* <UniversalFilter
                showCorridor
                showTimeRange
                defaultValues={{
                  corridor: corridorId || "",
                  timeRange: "90d",
                }}
                onChange={(filters) => {
                  setShipFilters(filters);
                }}
              /> */}
            </div>
          }
        >
          <div className="tp-grid tp-ship-grid">
            {OverviewData?.shippingData?.data?.map((s, i) => (
              <div key={i} className="tp-ship-card">
                <div className="tp-ship-header">
                  <div>
                    <h4 className="tp-ship-route">{s.route}</h4>
                    <span className="tp-ship-port">
                      {s.portName ? s.portName : "0 Apapa Port"}
                    </span>
                  </div>

                  <span className="tp-ship-days">
                    {s.transitDays ? `${s.transitDays} Days` : "0 Days"}
                  </span>
                </div>

                <div className="tp-ship-footer">
                  <strong className="tp-ship-price">{s.price}</strong>

                  <span
                    className={`tp-ship-change ${
                      s.change != 0
                        ? s.change > 0
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
            showCorridor
            showTimeRange
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
            showCorridor
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
