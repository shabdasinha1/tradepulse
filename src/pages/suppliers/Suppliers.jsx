
import { useEffect, useRef, useState } from "react";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiPlus, FiStar } from "react-icons/fi";
import { DashboardSuppliers } from "../../services/DashboardService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [suppliers, setSuppliers] = useState([]);

  // Current page number (backend pagination)
  const [page, setPage] = useState(1);

  // Determines if more data is available from backend
  const [hasMore, setHasMore] = useState(true);

  // Reference element used by IntersectionObserver
  const observerRef = useRef(null);

  const tableScrollRef = useRef(null);

  /* ===============================
     FETCH SUPPLIERS FROM API
  =============================== */
  const fetchSuppliers = async () => {
    // Prevent multiple API calls at the same time and stop if backend already returned all data
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await DashboardSuppliers({ page, limit: LIMIT });

      // Extract suppliers list from backend response
      const newSuppliers = res?.data?.data?.suppliers || [];

      /*
       * If backend returns fewer items than LIMIT,
       * it means no more data is available
       */
      if (newSuppliers.length < LIMIT) {
        // console.log("🛑 No more data available");
        setHasMore(false);
      }

      // Append new suppliers to existing list
      setSuppliers((prev) => [...prev, ...newSuppliers]);
    } catch (err) {
      setError(GetApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const data = async () => {
    const res = await DashboardSuppliers(1, 5);
    return res.data;
  };

  /* ===============================
     FETCH DATA WHEN PAGE CHANGES
  =============================== */
  useEffect(() => {
    fetchSuppliers();
  }, [page]);

  useEffect(() => {
    const res = data();
    // console.log("DATA : ", res);
  }, []);
  /* ===============================
     INTERSECTION OBSERVER
     Triggers when user scrolls to bottom
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
      <div className="tp-container tp-grid-stack">
        {/* ===============================
            PAGE HEADER
        =============================== */}
        <header>
          <h1 className="tp-section-title">
            Trusted <span>Suppliers</span>
          </h1>
          <p className="tp-section-sub">
            Verified trade partners across African markets
          </p>
        </header>

        {/* ===============================
            SUPPLIERS TABLE
        =============================== */}
        <TradePulseCard
          header={
            <div className="tp-card-header tp-supplier-header">
              <h3 className="tp-card-title">Supplier Directory</h3>

              <button className="tp-btn-primary tp-btn-sm">
                <FiPlus /> Add Supplier
              </button>
            </div>
          }
        >
          {/* TABLE HEADER */}
          <div className="tp-table-head tp-table-suppliers">
            <span>Supplier</span>
            <span className="text-center">Country</span>
            <span className="text-center">Trust</span>
            <span className="text-center">Status</span>
            <span className="text-center">Trades</span>
            <span className="text-center">Catalog</span>
            <span />
          </div>

          {/* TABLE BODY */}
          <div className="tp-table-scroll" ref={tableScrollRef}>
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

                  <a className="supplier-link text-center">{s.catalog_size}</a>

                  <FiStar className="tp-star" />
                </div>
              ))}

              {/* SKELETON WHILE LOADING NEXT PAGE */}
              {isLoading &&
                [...Array(5)].map((_, i) => (
                  <SupplierRowSkeleton key={`skeleton-${i}`} />
                ))}
            </div>
            {/* ===============================
                LOADING / SCROLL MARKER
            =============================== */}
            {hasMore && (
              <div
                ref={observerRef}
                className="text-center tp-muted"
                style={{ padding: 16 }}
              >
                {isLoading ? "Loading more suppliers..." : "Scroll for more"}
              </div>
            )}
            {/* END OF DATA MESSAGE */}
            {!hasMore && (
              <div className="text-center tp-muted" style={{ padding: 20 }}>
                ✅ No more suppliers
              </div>
            )}
          </div>

          {/* ERROR MESSAGE */}
          {error && <div className="text-center tp-text-danger">{error}</div>}
        </TradePulseCard>
      </div>
    </section>
  );
};

export default Suppliers;
