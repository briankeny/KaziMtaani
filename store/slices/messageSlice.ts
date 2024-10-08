import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: [],
    conversation:{},
    messages:[],
    message:{},
    drafts: <any> [],
    scrollYMessages:0,
    search : null,
    searchTerm : null
}

const messageSlice = createSlice({
    name:'messages',
    initialState,
    reducers: {
        setScrollYMess :(state,action) =>{
            state.scrollYMessages = parseInt(action.payload)
          },
          removeDrafts :(state,action)=>{
            const curr =  action.payload
            state.drafts = state.drafts.map((item:any)=> item !=  curr)
        },
        setDrafts :(state,action)=>{
            const curr =  action.payload
            state.drafts = state.drafts.push(curr)
        },
        setConvo: (state,action)=>{
            state.conversation = action.payload
        },
        setConvos : (state, action)=>{
            state.conversations = action.payload
        },
        setMessage: (state, action)=>{
            state.message = action.payload
        },
        setMessages: (state, action)=>{
            state.messages = action.payload
        }
        ,setSearch :(state,action)=>{
          state.search = action.payload
        }
        ,setSearchTerm :(state,action)=>{
            state.searchTerm = action.payload
        }
    }
})



export const {setConvo,setConvos,setDrafts,setMessage,setScrollYMess,setSearch,setSearchTerm,setMessages} = messageSlice.actions

export default messageSlice.reducer;






