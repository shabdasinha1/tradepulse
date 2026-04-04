import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { DashboardExchangeRate } from "../services/DashboardService";
import { normalizeFxRates } from "../utils/fxNormalizer";
import { setExchangeRates } from "../store/slices/fxSlice";
import { IsAuthenticated } from "../utils/AuthHelper";

const useGlobalFx = () => {
  const dispatch = useDispatch();
const isAuthenticated = IsAuthenticated();
const isDashboardPage = window.location.pathname.startsWith("/overview");
  const { reporterCode, partnerCode } = useSelector(
    (state) => state.corridor
  );

  const { rates } = useSelector((state) => state.fx);

  const isFxAlreadyLoaded = Object.keys(rates).length > 1;

  const { data } = useQuery({
    queryKey: ["fx-global", reporterCode, partnerCode],
    queryFn: () =>
      DashboardExchangeRate({
        reporterCode,
        partnerCode,
      }),
    enabled: isAuthenticated && isDashboardPage && !!reporterCode && !!partnerCode && !isFxAlreadyLoaded,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!data?.data) return;

    const normalized = normalizeFxRates(data.data);

    if (Object.keys(normalized).length <= 1) return;

    dispatch(
      setExchangeRates({
        rates: normalized,
        lastUpdated: new Date().toISOString(),
      })
    );
  }, [data]);

  return null;
};

export default useGlobalFx;