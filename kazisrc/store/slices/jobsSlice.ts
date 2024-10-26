import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobposts: <Array<any> | any> [],
    jobpost: <object | any> {},
    screen:<string>'',
    searchJSQuery : <string>  '',
    searchJSTerm : <string | any> '',
    searchfilters: <Array<any> | any> []
}

const jobsSlice = createSlice({
    name:'jobs',
    initialState,
    reducers: {
       setJobPosts:((state,action)=>{
        state.jobposts = action.payload
       }),
       setJobPost:((state,action)=>{
        state.jobpost = action.payload
       }),
       setScreen:((state,action)=>{
        state.screen = action.payload
       }),
       setSearchJSQuery:((state,action)=>{
        state.searchJSQuery = action.payload
       }),
       setSearchJSTerm:((state,action)=>{
        state.searchJSTerm = action.payload
       })
    }
})



export const {setJobPost,setJobPosts,setScreen,setSearchJSQuery,setSearchJSTerm} = jobsSlice.actions

export default jobsSlice.reducer;






