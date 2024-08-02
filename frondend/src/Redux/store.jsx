import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Authentication/authenticationSlice'

export const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });
  



// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// import authReducer from './Authentication/authenticationSlice';

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//   },

  

//   // middleware: (getDefaultMiddleware) =>
//   //   getDefaultMiddleware({
//   //     serializableCheck: {
//   //       ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//   //     },
//   //   }),



// });

// export const persistor = persistStore(store);
