import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import TradePulseCard from "../../components/common/TradePulseCard.jsx";
import { FiSliders } from "react-icons/fi";
import {

  DashboardCompanySuppliers,
} from "../../services/DashboardService.jsx";

import GlobalFilterPanel from "../../components/global/GlobalFilterPanel.jsx";
import PageDisclaimer from "../../components/common/PageDisclaimer.jsx";
import { queryKeys } from "../../utils/queryKeys";
import EmptyState from "../../components/common/EmptyState";
import UniversalFilter from "../../components/common/UniversalFilter";

import { CiFilter } from "react-icons/ci";
import { useAppToast } from "../../components/common/toast/toast.js";
import { Tooltip } from "react-tooltip";

const LIMIT = 20;
/* ==========================================================
          MODAL FOR SUPPLIERS TABLE
 ==========================================================*/
const SupplierModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="tp-supplier-modal-overlay" onClick={onClose}>
      <div
        className="tp-supplier-modal tp-supplier-modal-upgraded"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="tp-supplier-modal-header upgraded">
          <div>
            <h2>{data.name}</h2>
            <p className="tp-modal-sub">
              {data.iso_3} • {data.region}
            </p>
          </div>

          <div className="tp-modal-header-right">
            <span className="tp-pill tp-pill-primary">{data.tag}</span>

            <button onClick={onClose} className="tp-filter-close">
              ✕
            </button>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="tp-supplier-modal-body upgraded">
          {/* ===== METRICS ===== */}
          <div className="tp-modal-metrics">
            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value tp-font-data">
                {data.reliabilityScore}
              </span>
              <span className="tp-modal-metric-label">Reliability</span>
            </div>
            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value tp-font-data">{data.shipments}</span>
              <span className="tp-modal-metric-label">Shipments</span>
            </div>
            <div className="tp-modal-metric">
              <span className="tp-modal-metric-value tp-font-data">
                {data.productDiversity}
              </span>
              <span className="tp-modal-metric-label">Products</span>
            </div>
            reparations
          </div>

          {/* ===== DETAILS GRID ===== */}
          <div className="tp-modal-grid">
            <div>
              <span className="tp-modal-label">Country</span>
              <span>{data.iso_3}</span>
            </div>

            <div>
              <span className="tp-modal-label">Sector</span>
              <span>{data.sector}</span>
            </div>

            <div>
              <span className="tp-modal-label">Region</span>
              <span>{data.region}</span>
            </div>

            <div>
              <span className="tp-modal-label">Status</span>
              <span>{data.verification_status}</span>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="tp-supplier-modal-footer">
          <button className="tp-btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



const Suppliers = () => {
  const toast = useAppToast();
  const [isCompanyView] = useState(true);

  const [filterOpen, setFilterOpen] = useState(false);
  const [tableFilterOpen, setTableFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

const {
  tradeflow,
  reporterCode,
  startDate,
  endDate,
  corridor,
  partnerCode,
  region,
  partnerRegion,
  partnerCountryCode,
  productId,
} = useSelector((state) => state.corridor);


  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const observer = useRef(null);


  const handleHeaderScroll = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  };

  const handleBodyScroll = () => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  const shortCorridor = useMemo(() => {
    return corridor?.includes(",") ? corridor.split(",")[0] + "..." : corridor;
  }, [corridor]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
   queryKey: queryKeys.companySuppliers({
  search,
  // tradeflow,
  // reporterCode,
  // partnerCode,
  partnerRegion,
  partnerCountryCode,
  productId,
}),

    queryFn: async ({ pageParam = 1 }) => {
      const res = await DashboardCompanySuppliers({
  page: pageParam,
  limit: LIMIT,

  search,

  country: partnerCountryCode,
  hsCode: productId,
  region: partnerRegion,

  // tradeflow,
  // reporterCode,
  // partnerCode,
});

      return res?.data || {};
    },

    getNextPageParam: (lastPage, pages) => {
      const total = lastPage?.total || 0;
      const loaded = pages.flatMap((p) => p.suppliers || []).length;

      return loaded < total ? pages.length + 1 : undefined;
    },

    refetchOnWindowFocus: false,
  });

  const companySuppliers = useMemo(() => {
    return data?.pages?.flatMap((p) => p.suppliers || []) || [];
  }, [data]);



  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const getStatusClass = (status) => {
    switch (status) {
      case "VERIFIED":
        return "tp-pill-success";
      case "PARTIAL":
        return "tp-pill-warning";
      case "UNVERIFIED":
        return "tp-pill-danger";
      default:
        return "tp-pill-primary";
    }
  };

  const lastSupplierRef = React.useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        <header>
          <h1 className="tp-section-title">
            Supplier <span>Intelligence</span>
          </h1>

          <div className="tp-overview-sub-row">
            <p className="tp-section-sub">
              Structured exporter activity insights within selected corridor.
            </p>

            <div className="tp-filter-btn-wrapper">
                          
            </div>
          </div>
        </header>

        <span className="tp-product-disclaimer">
          <PageDisclaimer />
        </span>

        <TradePulseCard
          header={
            <div className="tp-card-header tp-supplier-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >

                <h3 className="tp-card-title">Supplier Directory</h3>
              </div>

              {/* ✅ ADD THIS BLOCK */}
              {isCompanyView ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Search company..."
                    className="tp-input"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />

                  <button
                    className="tp-btn-outline tp-btn-sm"
                    onClick={() => { }}
                  >
                    Search
                  </button>

                  {/* ✅ ADD THIS FILTER BUTTON */}
                  {/* <button
                    className="tp-btn-outline tp-btn-sm"
                    onClick={() => setTableFilterOpen(true)}
                  >
                    <CiFilter />
                  </button> */}
                </div>
              ) : (
                <button
                  className="tp-btn-outline tp-overview-filter-btn"
                  onClick={() => setTableFilterOpen(true)}
                >
                  <CiFilter />
                  Filters
                </button>
              )}
            </div>
          }
        >
          <div className="tp-table-wrapper-suppliers">
            {/* HEADER SCROLL */}
            <div
              className="tp-table-head-scroll"
              ref={headerRef}
              onScroll={handleHeaderScroll}
            >
              <div className="tp-table-head tp-table-suppliers-dashboard">

                <>
                  <span>Company Name</span>
                  <span className="text-center">Country</span>
                  <span className="text-center">Region</span>
                  <span className="text-center">Sector</span>
                  <span className="text-center">Reliability</span>
                  <span className="text-center">Status</span>
                  <span className="text-center">Products</span>
                  <span className="text-center">Product Count</span>
                </>

              </div>
            </div>

            {/* BODY SCROLL */}
            <div
              className="tp-table-body-scroll"
              ref={bodyRef}
              onScroll={handleBodyScroll}
            >
              <div className="tp-table">
                {isLoading && (
                  <div className="tp-table-loader">
                    Loading suppliers...
                  </div>
                )}


               {companySuppliers.map((c, i) => {
  const product = c.products?.join(", ") || "-";
  const isLong = product.length > 50;

  return (
    <div
      key={c.id || i}
      ref={companySuppliers.length === i + 1 ? lastSupplierRef : null}
      className="tp-table-row tp-table-suppliers-dashboard"
    >
      {/* Company Name */}
      <div className="supplier-name">
        <strong>{c.company_name || "-"}</strong>
      </div>

      {/* Country */}
      <span className="text-center">
        {c.country_name || "-"}
        <div className="tp-country-code">
          {c.country_iso3 || "-"}
        </div>
      </span>

      {/* Region */}
      <span className="text-center">
        {c.region || "-"}
      </span>

      {/* Sector */}
      <span className="text-center">
        {c.sector || "-"}
      </span>

      {/* Reliability */}
      <span className="text-center">
        <span
          className={`tp-pill tp-font-data ${
            c.reliability_score < 0.5
              ? "tp-pill-danger"
              : c.reliability_score < 0.8
              ? "tp-pill-warning"
              : "tp-pill-success"
          }`}
        >
          {c.reliability_score ?? "-"}
        </span>
      </span>

      {/* Verification Status */}
      <span className="text-center">
        <span
          className={`tp-pill ${getStatusClass(
            c.verification_status
          )}`}
        >
          {c.verification_status || "-"}
        </span>
      </span>

      {/* Products */}
      <span
        className="text-center tp-product-cell"
        data-tooltip-id={isLong ? "my-tooltip" : undefined}
        data-tooltip-content={isLong ? product : undefined}
      >
        {isLong ? product.slice(0, 50) + "..." : product}
      </span>

      {/* Tooltip */}
      <Tooltip
        id="my-tooltip"
        className="tp-custom-tooltip"
        place="top"
        positionStrategy="fixed"
        globalCloseEvents={{ scroll: true }}
      />

      {/* Product Count */}
      <span className="text-center tp-font-data">
        {c.product_count || 0}
      </span>
    </div>
  );
})}
                {isFetchingNextPage && (
                  <div className="tp-table-loader">
                    Loading more suppliers...
                  </div>
                )}

              </div>
              {!isLoading && companySuppliers.length === 0 && (
                <EmptyState message="No suppliers found" />
              )}
            </div>
          </div>
        </TradePulseCard>
      </div>

      {filterOpen && <GlobalFilterPanel onClose={() => setFilterOpen(false)} />}
      {tableFilterOpen && (
        <span className="tp-supplier-universal-filter-wrapper">
          <UniversalFilter
            showProduct={true}
            onClose={() => setTableFilterOpen(false)}
            onChange={(filters) => {
              console.log("FILTERS:", filters);





              setTableFilterOpen(false);
            }}
          />
        </span>
      )}
    </section>
  );
};

export default Suppliers;
