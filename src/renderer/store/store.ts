import { configureStore } from '@reduxjs/toolkit';

import menusReducer from './menu';

const store = configureStore({
  reducer: {
    menus: menusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
