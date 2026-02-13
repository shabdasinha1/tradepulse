import React from "react";

const VerticalScroll = ({ children, className="", ...rest }) => {
  return (
    <div className={className}  {...rest}  >
      {children}
    </div>
  );
};

export default VerticalScroll;
