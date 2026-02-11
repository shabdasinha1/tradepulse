import { updatePrices } from "../features/prices/PriceSlice.jsx";
import { addNotification } from "../features/notifications/NotificationSlice.jsx";

export const socketEventMap = {
  PRICE_UPDATE: updatePrices,
  NOTIFICATION: addNotification,
};
