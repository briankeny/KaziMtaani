import axios from "axios";
import { configureStore, combineReducers} from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from "react-redux";
// import { ThunkAction, thunk } from "redux-thunk";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Action } from "redux";

import themeReducer from  './slices/themeSlice';
import authReducer, {setAuth, setTokens} from "./slices/authSlice";
import modalReducer, { rendermodal} from "./slices/modalSlice";

import notificationsReducer from "./slices/notificationSlice";
import messageSlice from "./slices/messageSlice";
import jobsSlice from "./slices/jobsSlice";

import  {authApi} from "./services/authApi";

import { baseUrl } from "./api";

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  jobs:jobsSlice,
  modal:modalReducer,
  notifications:notificationsReducer,
  messages:messageSlice,
[authApi.reducerPath]:authApi.reducer,

});

// Configure Redux Persist options
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // blacklist: ["_persist",authApi.reducerPath],
  blacklist:["_persist", "authApi"],
  // whitelist: [],
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure your Redux store
export const store = configureStore({
  reducer: persistedReducer,
  // Use THe Default MiddleWare
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    // Disable serializable check middleware
    serializableCheck: {
      ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER]
    }, 
  })
  .concat(authApi.middleware)
    .concat((store) => (next) => async (action:any) => {
      if (
        action.type.endsWith('rejected') && 
      action.payload?.data?.code === 'token_not_valid' && 
      action.payload.status === 401) {   
      try{
        const state = await store.getState() as RootState;
        const  refresh = await state['auth'].refreshToken;
        const data = await try_re_auth_procedure(refresh)
        data &&  store.dispatch(setTokens(data))
      }
      catch(error:any){
        rendermodal({
          dispatch : store.dispatch,
          header:'Authentication Error!',
          status:'error',
          content:'Your login session has expired please login again to continue!'});
        store.dispatch(setAuth(false))
      }
      }
      return next(action);
    }),
});

setupListeners(store.dispatch)

// Create a persistor object to persist the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState >
export type AppDispatch = typeof store.dispatch
// export type AppThunk = ThunkAction <void,RootState,null,Action<string>>

export const useAppDispatch: () => AppDispatch = useDispatch 

export const useSelector : TypedUseSelectorHook <RootState> = useReduxSelector

export async  function try_re_auth_procedure(refreshToken:any){
  let json = <any> {}
  try {
    const resp = await getAccessToken(refreshToken)
    
    if ( !(resp.status == undefined) &&( resp.status == 201 || resp.status == 200)){
        json['refresh'] = refreshToken
        json['access'] = resp?.data?.access
        return json
      }
      else{
        throw new Error ('Your Login Session Has Expired!')
    }
    }
    catch (error:any){
      throw new error (error.message)
    }
}


export async function getAccessToken (refreshToken:any) {
  try {
  const data =  {"refresh": refreshToken }
  const resp = await axios.post(`${baseUrl}/token/refresh/`,data,{
    headers:{
      'Content-Type':'Application/json'
    }
  })
  
  return resp
  }
  catch(error:any){
    throw new Error(error.message)
  }
}