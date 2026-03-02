import { useDispatch, useSelector } from "react-redux";
import {
  setCorridor,
  setProduct,
  setTimeRange,
} from "../../store/slices/corridorSlice";

const corridorOptions = [
  { id: "uk-ng", label: "UK ↔ Nigeria" },
  { id: "uk-gh", label: "UK ↔ Ghana" },
  { id: "uk-ke", label: "UK ↔ Kenya" },
  { id: "uk-za", label: "UK ↔ South Africa" },
];

const timeOptions = [
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "6m", label: "Last 6 Months" },
  { id: "12m", label: "Last 12 Months" },
];

function CorridorFilterBar() {
  const dispatch = useDispatch();

  const { corridorId, productId, timeRange } = useSelector(
    (state) => state.corridor
  );

  const handleCorridorChange = (e) => {
    dispatch(setCorridor(e.target.value));
  };

  const handleProductChange = (e) => {
    dispatch(setProduct(e.target.value));
  };

  const handleTimeChange = (e) => {
    dispatch(setTimeRange(e.target.value));
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "16px",
        background: "#0f172a",
        borderBottom: "1px solid #1e293b",
      }}
    >
      {/* Corridor */}
      <div>
        <label style={{ fontSize: "12px", color: "#94a3b8" }}>
          Corridor
        </label>
        <br />
        <select
          value={corridorId || ""}
          onChange={handleCorridorChange}
        >
          <option value="">Select Corridor</option>
          {corridorOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product (placeholder for now) */}
      <div>
        <label style={{ fontSize: "12px", color: "#94a3b8" }}>
          Product
        </label>
        <br />
        <select
          value={productId || ""}
          onChange={handleProductChange}
        >
          <option value="">All Products</option>
          <option value="cocoa">Cocoa Beans</option>
          <option value="oil">Crude Oil</option>
          <option value="tea">Tea</option>
        </select>
      </div>

      {/* Time Range */}
      <div>
        <label style={{ fontSize: "12px", color: "#94a3b8" }}>
          Time Range
        </label>
        <br />
        <select
          value={timeRange}
          onChange={handleTimeChange}
        >
          {timeOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CorridorFilterBar;