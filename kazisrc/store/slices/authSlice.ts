import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authentication: false,
    authscreen_index:0,
    myLocation:{},
    onlineStatus:false,
    authError:"",
    userData:{},
    userSkills:[],
    userSections:[],
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
      setMyLocation : (state,action)=> {
        state.myLocation = action.payload
      },
      setAuthScreenIndex: (state,action)=> {
        state.myLocation = action.payload
      },
      setOnlineStatus:(state,action)=>{
        state.onlineStatus = action.payload
      },
      setUserSkills:(state,action) =>{
        state.userSkills = action.payload
      },
      setUserSections:(state,action) =>{
        state.userSections = action.payload
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

export const {setAuth,setUser,setAuthError,setUserSkills,setUserSections,
  setAuthScreenIndex,setMyLocation,setOnlineStatus,setTokens} = authSlice.actions
 
export default authSlice.reducer;