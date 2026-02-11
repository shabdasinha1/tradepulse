import { configureStore } from "@reduxjs/toolkit";
import { socketMiddleware } from "../websocket/SocketMiddleware.jsx";
import rootReducer from "./RootReducer.jsx";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(socketMiddleware),
});
