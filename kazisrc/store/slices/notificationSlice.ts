import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   notifications:[],
   notific_count :0,
   scrollYNotifications:0,
}

const notificationsSlice = createSlice({
    name:'notifications',
    initialState,
    reducers: {
        setScrollYNotif :(state,action) =>{
            state.scrollYNotifications = parseInt(action.payload)
          },
        
        setNotifications:(state, action)=>{
            state.notifications = action.payload
        },

        setNewNotifications:(state, action)=>{
            state.notific_count = action.payload
        }
    }
})



export const {setScrollYNotif,setNotifications,setNewNotifications} = notificationsSlice.actions

export default notificationsSlice.reducer;






