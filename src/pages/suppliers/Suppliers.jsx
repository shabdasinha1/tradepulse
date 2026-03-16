import React,{ useState,useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiSliders } from "react-icons/fi";
import { DashboardSuppliers } from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import { queryKeys } from "../../utils/queryKeys";

const LIMIT = 20;

/* ==========================================================
          SKELTON FOR SUPPLIERS
 ==========================================================*/

const SupplierRowSkeleton = React.memo(() => {
  return (
    <div className="tp-table-row tp-table-suppliers skeleton">
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-text" />
    </div>
  );
});

const Suppliers = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  const { reporterCode, startDate, endDate, corridor } = useSelector(
    (state) => state.corridor
  );
const skeletonRows = useMemo(
  () =>
    [...Array(5)].map((_, i) => (
      <SupplierRowSkeleton key={`skeleton-${i}`} />
    )),
  []
);

const shortCorridor = useMemo(() => {
  return corridor?.includes(",")
    ? corridor.split(",")[0] + "..."
    : corridor;
}, [corridor]);
  /* ===============================
     FETCH SUPPLIERS USING REACT QUERY
  =============================== */

  const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.suppliers(reporterCode, startDate, endDate),
  queryFn: async () => {
    const res = await DashboardSuppliers({
      reporterCode,
      startDate,
      endDate,
      page: 1,
      limit: LIMIT,
    });

    return res.data.suppliers || [];
  },
  enabled: !!reporterCode,
  staleTime: 1000 * 60 * 5,
});

  const suppliers = useMemo(() => data || [], [data]);


  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        <header>
          <h1 className="tp-section-title">
            Exporter Reliability <span>Intelligence</span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Structured exporter activity insights within selected corridor.
            </p>

            <div className="tp-filter-btn-wrapper">
              <div className="tp-corridor-pill">
                <span className="tp-country">Active Corridor : </span>

                <span
                  className="tp-country tp-country-truncate"
                  title={corridor || "Selected Corridor"}
                >
                  {shortCorridor}
                </span>
              </div>

              <button
                className="tp-btn-outline tp-overview-filter-btn"
                onClick={() => setFilterOpen(true)}
              >
                <FiSliders />
                Filters
              </button>
            </div>
          </div>
        </header>

        <span className="tp-product-disclaimer">
          <PageDisclaimer />
        </span>

        <TradePulseCard
          header={
            <div className="tp-card-header tp-supplier-header">
              <h3 className="tp-card-title">Supplier Directory</h3>
            </div>
          }
        >
          <div className="tp-table-wrapper-suppliers">
            <div className="tp-table-hr-scroll">
              <div className="tp-table-head tp-table-suppliers">
                <span>Exporter Name</span>
                <span className="text-center">Origin Country</span>
                <span className="text-center">Reliability Score</span>
                <span className="text-center">Activity Level</span>
                <span className="text-center">
                  Shipment Frequency 
                </span>
              </div>

              <div className="tp-table">

                {/* LOADING SKELETON */}
                {isLoading && skeletonRows}

                {/* SUPPLIERS DATA */}
                {!isLoading &&
                  suppliers?.map((s, i) => (
                    <div key={i} className="tp-table-row tp-table-suppliers">

                      <div className="supplier-name">
                        <strong>{s.exporter_name}</strong>
                      </div>

                      <span className="tp-muted text-center">
                        {s.origin_region}
                      </span>

                      <span className="text-center">
                        <span
                          className={`tp-pill ${
                            s.reliability_score >= 70
                              ? "tp-pill-success"
                              : "tp-pill-warning"
                          }`}
                        >
                          {s.reliability_score}
                        </span>
                      </span>

                      <span className="text-center">
                        <span className="tp-pill tp-pill-primary">
                          {s.activity_level}
                        </span>
                      </span>

                      <strong className="text-center">
                        {s.trade_activity}
                      </strong>

                    </div>
                  ))}

                {/* NO DATA */}
                {!isLoading && suppliers.length === 0 && (
                  <div className="text-center tp-muted" style={{ padding: 20 }}>
                    No suppliers found
                  </div>
                )}

                {/* ERROR */}
                {error && (
                  <div className="text-center tp-text-danger">
                    {GetApiErrorMessage(error)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TradePulseCard>
      </div>

      {filterOpen && (
        <GlobalFilterPanel onClose={() => setFilterOpen(false)} />
      )}
    </section>
  );
};

export default Suppliers;