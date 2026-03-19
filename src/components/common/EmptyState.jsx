import React from "react";

const EmptyState = ({ message = "No Data Found" }) => {
  return (
    <div className="tp-empty-state">
      <span className="tp-empty-text">{message}</span>
    </div>
  );
};

export default EmptyState;
