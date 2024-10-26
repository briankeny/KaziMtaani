import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications:{
        vibration:false,
        push_on:false,
        show_alert:false,
        notific_sound:""
    },
    messages:{
      vibration:false,
      push_on:false,
      show_alert:false,
      notific_sound:"",
      direct_message: true,
  }
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
      updateNotificSetting : (state,action)=>{
        const {key,val} = action.payload;
        setterFunc(state.notifications,key,val)
      },
      updateMessageSetting : (state,action)=>{
        const {key,val} = action.payload;
        setterFunc(state.messages,key,val)
      }
    }
}
)


export const {updateNotificSetting,updateMessageSetting} = settingsSlice.actions

export default  settingsSlice.reducer


export function setterFunc(state:any,key:string,val:any){
    switch(key){
      case 'vibration': 
      state.vibration = val
      break
      ;
      case 'push': 
      state.push_on = val
      break
      ;
      case 'alert': 
      state.show_alert = val
      break
      ;
      case 'sound': 
      state.notific_sound = val
      break
      ;
      case 'direct': 
      state.direct = val
      break;

      default:
      break    
      ;

  }
}
