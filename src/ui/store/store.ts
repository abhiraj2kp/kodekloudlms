import { Storage } from 'redux-persist'
import { MMKV } from "react-native-mmkv"
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { homeSlice } from '@ui/slices/homeSlice/homeSlice';

export const mmkvStorage = new MMKV()

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    mmkvStorage.set(key, value)
    return Promise.resolve(true)
  },
  getItem: (key) => {
    const value = mmkvStorage.getString(key)
    return Promise.resolve(value)
  },
  removeItem: (key) => {
    mmkvStorage.delete(key)
    return Promise.resolve()
  },
}

/**
 * @description Defined the redux persist config
 */
const persistConfig = {
  key: 'root',
  whitelist: ['homeReducer'],
  storage: reduxStorage,
};




/**
 * @description Created a root reducer that combines the all required reducers
 */
const appReducer = combineReducers({
  homeReducer: homeSlice.reducer
});

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action);
};

/**
 * @description Defined the redux persist config
 */

const logger = createLogger({
  // ...options
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: false,
    }).concat(logger),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
