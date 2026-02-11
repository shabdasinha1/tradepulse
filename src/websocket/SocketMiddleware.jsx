import { socketClient } from "./SocketClient.jsx";
import { socketEventMap } from "./SocketEvents.jsx";

export const socketMiddleware = (store) => (next) => (action) => {
  if (action.type === "socket/connect") {
    socketClient.connect(action.payload.url, (data) => {
      const reduxAction = socketEventMap[data.type];
      if (reduxAction) {
        store.dispatch(reduxAction(data.payload));
      }
    });
  }

  if (action.type === "socket/send") {
    socketClient.send(action.payload);
  }

  if (action.type === "socket/disconnect") {
    socketClient.disconnect();
  }

  return next(action);
};
