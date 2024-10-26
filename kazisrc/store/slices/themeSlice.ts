import { createSlice } from "@reduxjs/toolkit"
import { save} from "../storage"
import { Theme } from "../types/types"

export const colorsdark:Theme ={
    background: '#111',
    primary: "#111",
    card: "#222",
    text: "#fff",
    border: "#888",
    notification: "#777",
    postBackground:'rgba(29, 161, 242,0.2)'
}

export const colorslight:Theme ={
    background: "rgba(255,255,255,0.6)",
    primary: "#fff",
    card: "#fff",
    text: "#111",
    border: "#888",
    notification: "#fff",
    postBackground:'rgba(29, 161, 242,0.2)'
}



const initialState = {
    isNightMode : false,
    theme: colorslight,
    current_theme:'default'
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
      setTheme : (state, action) =>{
        const {selected,appearance} = action.payload
        switch(selected){
          case 'dark': 
           state.theme =colorsdark
           state.isNightMode = true
           state.current_theme = selected
           save('theme', 'dark')
           break;
          case 'light':
            state.theme = colorslight
            state.isNightMode =false
            state.current_theme = selected
            save('theme', 'light')
            break;
          case 'default':
              state.theme =  appearance == 'light'? state.theme = colorslight:state.theme = colorsdark
              state.isNightMode = appearance == 'light' ? false : true
              state.current_theme = selected
              save('theme',selected)
              break;
          default:
            break; 
        }

      }
    }
}
)

export const {setTheme} = themeSlice.actions
export default  themeSlice.reducer