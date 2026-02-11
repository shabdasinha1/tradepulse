import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  unreadCount: 0,
};

const NotificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },

    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAllAsRead,
  clearNotifications,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
