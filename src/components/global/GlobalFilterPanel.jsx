import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import {
  setCorridor,
  setProduct,
  setTimeRange,
} from "../../store/slices/corridorSlice";

function GlobalFilterPanel({ onClose }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const [isClosing, setIsClosing] = useState(false);

  const { corridorId, productId, timeRange } = useSelector(
    (state) => state.corridor
  );

  /* =========================
     LOCAL STATE (TEMP)
  ========================== */
  const [localCorridor, setLocalCorridor] = useState(corridorId);
  const [localProduct, setLocalProduct] = useState(productId);
  const [localTimeRange, setLocalTimeRange] = useState(timeRange);

  /* =========================
     LOCK BODY SCROLL
  ========================== */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* =========================
     ESC CLOSE
  ========================== */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  /* =========================
     APPLY FILTERS
  ========================== */
  const handleApply = () => {
    dispatch(setCorridor(localCorridor));
    dispatch(setProduct(localProduct));
    dispatch(setTimeRange(localTimeRange));
    handleClose();
  };

  /* =========================
     RESET FILTERS
  ========================== */
  const handleReset = () => {
    setLocalCorridor("");
    setLocalProduct("");
    setLocalTimeRange("90d");

    dispatch(setCorridor(""));
    dispatch(setProduct(""));
    dispatch(setTimeRange("90d"));
  };

  const modalContent = (
    <div
      className={`tp-filter-overlay ${
        isClosing ? "tp-overlay-exit" : ""
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`tp-filter-panel tp-card ${
          isClosing ? "tp-panel-exit" : ""
        }`}
        ref={modalRef}
      >
        {/* HEADER */}
        <div className="tp-filter-header">
          <h3>Global Filters</h3>

          <button
            className="tp-filter-close"
            onClick={handleClose}
            aria-label="Close Filters"
          >
            <FiX />
          </button>
        </div>

        {/* BODY */}
        <div className="tp-filter-body">
          <div className="tp-form-group">
            <label>Corridor</label>
            <select
              className="tp-input tp-select"
              value={localCorridor}
              onChange={(e) => setLocalCorridor(e.target.value)}
            >
              <option value="">Select Corridor</option>
              <option value="uk-ng">UK ↔ Nigeria</option>
              <option value="uk-gh">UK ↔ Ghana</option>
              <option value="uk-ke">UK ↔ Kenya</option>
              <option value="uk-za">UK ↔ South Africa</option>
            </select>
          </div>

          <div className="tp-form-group">
            <label>Product</label>
            <select
              className="tp-input tp-select"
              value={localProduct}
              onChange={(e) => setLocalProduct(e.target.value)}
            >
              <option value="">All Products</option>
              <option value="cocoa">Cocoa Beans</option>
              <option value="oil">Crude Oil</option>
              <option value="tea">Tea</option>
            </select>
          </div>

          <div className="tp-form-group">
            <label>Time Range</label>
            <select
              className="tp-input tp-select"
              value={localTimeRange}
              onChange={(e) => setLocalTimeRange(e.target.value)}
            >
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="tp-filter-footer">
          <button
            className="tp-btn-outline"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            className="tp-btn-primary"
            onClick={handleApply}
          >
            Add Filters
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default GlobalFilterPanel;