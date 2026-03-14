import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function useUniversalFilters(defaultValues = {}) {

  const {
    reporterCode,
    partnerCode,
    productId,
    productLabel,
    startDate,
    endDate,
    corridor,
  } = useSelector((state) => state.corridor);

  const lastReduxSync = useRef({
    partnerCode,
    productId,
    startDate,
    endDate,
  });

  const [filters, setFilters] = useState({
    corridor: defaultValues.corridor || corridor || "",
    partnerCode: defaultValues.partnerCode || partnerCode || "",
    product: defaultValues.product || productId || "",
    productLabel: defaultValues.productLabel || productLabel || "",
    riskLevel: defaultValues.riskLevel || "",
    activityStatus: defaultValues.activityStatus || "",
    startDate: defaultValues.startDate || startDate || "",
    endDate: defaultValues.endDate || endDate || "",
    quoteCurrency: defaultValues.quoteCurrency || "",
    origin: defaultValues.origin || "",
    destination: defaultValues.destination || "",
  });

  console.log("latest local filter",filters);

  /* ===============================
     REDUX → LOCAL SYNC
  =============================== */

  useEffect(() => {

    const shouldSync =
      lastReduxSync.current.partnerCode !== partnerCode ||
      lastReduxSync.current.productId !== productId ||
      lastReduxSync.current.startDate !== startDate ||
      lastReduxSync.current.endDate !== endDate;

    if (!shouldSync) return;

    lastReduxSync.current = {
      partnerCode,
      productId,
      startDate,
      endDate,
    };

    setFilters((prev) => ({
      ...prev,
      corridor: corridor || "",
      partnerCode: partnerCode || "",
      product: productId || "",
      productLabel: productLabel || "",
      startDate: startDate || "",
      endDate: endDate || "",
    }));

  }, [
    partnerCode,
    productId,
    productLabel,
    startDate,
    endDate,
    corridor
  ]);

  /* ===============================
     UPDATE FILTER
  =============================== */

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ===============================
     RESET FILTERS
  =============================== */

  const resetFilters = () => {

    setFilters({
      corridor: corridor,
      partnerCode: partnerCode,
      product: "",
      productLabel: "",
      riskLevel: "",
      activityStatus: "",
      startDate: "",
      endDate: "",
      quoteCurrency: "",
      origin: "",
      destination: "",
    });

  };

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
  };
}