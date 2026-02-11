import useScrollReveal from "../../hooks/useScrollReveal.jsx";


const RouteReveal = ({ children }) => {
  const ref = useScrollReveal({
    direction: "up",
    once: true,
  });

  return <div ref={ref}>{children}</div>;
};

export default RouteReveal;
