import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    current_screen:'All',
    all_notifications:[],
    scrollYNotifications:0,
    search : null,
    searchTerm : null
}

const notificationsSlice = createSlice({
    name:'notifications',
    initialState,
    reducers: {
        setScrollYNotif :(state,action) =>{
            state.scrollYNotifications = parseInt(action.payload)
          },
        setCurrentScreen :(state,action)=>{
            state.current_screen = action.payload
        },
     
        setAll : (state, action)=>{
            state.all_notifications = action.payload
        }
        ,setSearch :(state,action)=>{
          state.search = action.payload
        }
        ,setSearchTerm :(state,action)=>{
            state.searchTerm = action.payload
        }
    }
})



export const {setAll,setCurrentScreen,setScrollYNotif,setSearch,setSearchTerm} = notificationsSlice.actions

export default notificationsSlice.reducer;






