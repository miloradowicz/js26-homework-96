import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { users } from '../features/users/usersSlice';
import { cocktailCreator } from '../features/slices/cocktailCreatorSlice';
import { cocktailDetailedViewer } from '../features/slices/cocktailDetailedViewerSlice';
import { cocktailsViewer } from '../features/slices/cocktailsViewerSlice';

const usersPersistConfig = {
  key: 'store:users',
  storage,
  whitelist: ['user'],
};

const reducer = combineReducers({
  users: persistReducer(usersPersistConfig, users),
  cocktailCreator,
  cocktailDetailedViewer,
  cocktailsViewer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
