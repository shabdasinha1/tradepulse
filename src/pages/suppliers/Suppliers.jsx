import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiPlus, FiStar } from "react-icons/fi";
import { DashboardSuppliers } from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";
import { FiSliders } from "react-icons/fi";
import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx"; // ✅ added
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import UniversalFilter from "../../components/common/UniversalFilter.jsx";

const LIMIT = 5;

/* ==========================================================
          SKELTON FOR SUPPLIERS
 ==========================================================*/

const SupplierRowSkeleton = () => {
  return (
    <div className="tp-table-row tp-table-suppliers skeleton">
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-pill" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-icon" />
    </div>
  );
};

const Suppliers = () => {
  const corridorId = useSelector((state) => state.corridor.corridorId);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { corridor } = useSelector((state) => state.corridor);
  const shortCorridor = corridor.includes(",")
    ? corridor.split(",")[0] + "..."
    : corridor;
  const observerRef = useRef(null);
  const tableScrollRef = useRef(null);

  const [filters, setFilters] = useState({
    corridor: corridorId || "",
    product: "",
    riskScore: "",
    activityStatus: "",
  });

  /* ===============================
     RESET WHEN CORRIDOR CHANGES
  =============================== */
  useEffect(() => {
    if (!corridorId) return;

    setSuppliers([]);
    setPage(1);
    setHasMore(true);
  }, [corridorId]);

  /* ===============================
     FETCH SUPPLIERS FROM API (Corridor Scoped)
  =============================== */
  const fetchSuppliers = async () => {
    if (isLoading || !hasMore || !corridorId) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await DashboardSuppliers({
        corridor_id: corridorId,
        page,
        limit: LIMIT,
      });

      const newSuppliers = res?.data?.data?.suppliers || [];

      if (newSuppliers.length < LIMIT) {
        setHasMore(false);
      }

      setSuppliers((prev) => [...prev, ...newSuppliers]);
    } catch (err) {
      setError(GetApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
     FETCH DATA WHEN PAGE CHANGES
  =============================== */
  useEffect(() => {
    // fetchSuppliers();
  }, [page, corridorId]);

  /* ===============================
     INTERSECTION OBSERVER
  =============================== */
  useEffect(() => {
    if (!observerRef.current || !hasMore || !tableScrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: tableScrollRef.current,
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

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
                {/* <span className="tp-arrow">→</span> */}
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
              {/*<button className="tp-btn-primary tp-btn-sm">
                <FiPlus /> Add Supplier
              </button> */}
              {/* <UniversalFilter
                showCorridor
                showProduct
                showRiskLevel
                showActivityStatus
                defaultValues={{
                  corridor: corridorId || "",
                  product: "",
                  riskScore: "",
                  activityStatus: "",
                }}
                onChange={(values) => {
                  setFilters(values);
                }}
              /> */}
            </div>
          }
        >
          <div className="tp-table-wrapper-suppliers" ref={tableScrollRef}>
            <div className="tp-table-hr-scroll">
              <div className="tp-table-head tp-table-suppliers">
                <span>Exporter Name</span>
                <span className="text-center">Origin Country</span>
                <span className="text-center">Reliability Score</span>
                <span className="text-center">Activity Level</span>
                <span className="text-center">
                  Shipment Frequency (Last 12M)
                </span>
                {/* <span /> */}
              </div>

              <div className="tp-table">
                {suppliers?.map((s, i) => (
                  <div key={i} className="tp-table-row tp-table-suppliers">
                    <div className="supplier-name">
                      <strong>{s.supplier_name}</strong>
                    </div>

                    <span className="tp-muted text-center">{s.country}</span>

                    <span className="text-center">
                      <span
                        className={`tp-pill ${
                          s.trust_score >= 85
                            ? "tp-pill-success"
                            : "tp-pill-warning"
                        }`}
                      >
                        {s.trust_score}
                      </span>
                    </span>

                    <span className="text-center">
                      <span
                        className={`tp-pill ${
                          s.status === "Verified"
                            ? "tp-pill-success"
                            : "tp-pill-warning"
                        }`}
                      >
                        {s.status}
                      </span>
                    </span>

                    <strong className="text-center">{s.trade_count}</strong>

                    {/* <a className="supplier-link text-center">
                      {s.catalog_size}
                    </a>

                    <FiStar className="tp-star" /> */}
                  </div>
                ))}

                {isLoading &&
                  [...Array(5)].map((_, i) => (
                    <SupplierRowSkeleton key={`skeleton-${i}`} />
                  ))}
              </div>

              {hasMore && (
                <div
                  ref={observerRef}
                  className="text-center tp-muted"
                  style={{ padding: 16 }}
                >
                  {isLoading ? "Loading more suppliers..." : "Scroll for more"}
                </div>
              )}

              {!hasMore && (
                <div className="text-center tp-muted" style={{ padding: 20 }}>
                  ✅ No more suppliers
                </div>
              )}

              {error && (
                <div className="text-center tp-text-danger">{error}</div>
              )}
            </div>
          </div>
        </TradePulseCard>
      </div>
      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}
    </section>
  );
};

export default Suppliers;
