import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authentication: false,
    myLocation:null,
    onlineStatus:false,
    authError:"",
    userData:{},
    accessToken:null,
    refreshToken:null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setUser : (state,action)=> {
        state.userData = action.payload
      },
      setLocation : (state,action)=> {
        state.myLocation = action.payload
      },
      setOnlineStatus:(state,action)=>{
        state.onlineStatus = action.payload
      },
      logout: (state)=>{
        state.authentication = false 
      },
      setAuth : (state,action)=> {
        state.authentication =  action.payload
      },
      setAuthError: (state,action) =>{
        state.authError = action.payload
      },
      setTokens:  (state,action)  =>{
        const {access,refresh} = action.payload
        state.accessToken =  access
        state.refreshToken = refresh
      }
    }
}
)

export const {setAuth,setUser,setAuthError,setLocation,setOnlineStatus,logout,setTokens} = authSlice.actions


export default authSlice.reducer;