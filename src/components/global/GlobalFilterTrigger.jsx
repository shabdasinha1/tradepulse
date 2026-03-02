import { useState, useRef, useEffect } from "react";
import { FiSliders } from "react-icons/fi";
import GlobalFilterPanel from "./GlobalFilterPanel";

function GlobalFilterTrigger() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="tp-global-filter" ref={wrapperRef}>
      <button
        className="tp-global-filter-btn"
        onClick={() => setOpen(!open)}
      >
        <FiSliders />
      </button>

      {open && <GlobalFilterPanel onClose={() => setOpen(false)} />}
    </div>
  );
}

export default GlobalFilterTrigger;