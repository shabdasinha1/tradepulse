import React, { useState, useRef, useEffect } from "react";
import { FiInfo } from "react-icons/fi";

const Tooltip = ({
  content,
  position = "top",
  className = "",
  tooltipClass = "",
  iconClass = "",
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    setIsMobile(media.matches);
  }, []);

  const timeoutRef = useRef(null);

  const showTooltip = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
      }, 100);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  const handleClick = (e) => {
    if (!isMobile) return;
    e.stopPropagation();
    setVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setVisible(false);
      }
    };

    if (visible && isMobile) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visible, isMobile]);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (
    <div ref={tooltipRef} className={`tp-tooltip-wrapper ${className}`}>
      {/* Trigger */}
      {children ? (
        <span
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onClick={handleClick}
        >
          {children}
        </span>
      ) : (
        <span
          className={`tp-tooltip-icon ${iconClass}`}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onClick={handleClick}
        >
          <FiInfo size={14} />
        </span>
      )}

      {/* Tooltip */}
      <div
        className={`tp-tooltip-box tp-tooltip-${position} ${
          visible ? "show" : ""
        } ${tooltipClass}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
