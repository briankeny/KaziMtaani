import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobposts: <Array<any> | any> [],
    jobapplications: <Array<any> | any> [],
    jobpost: <object | any> {},
    favouriteJobs :<Array<any> | any> [],
    screen:<string> '',
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
       setfavouriteJobs : ((state,action)=>{
        state.favouriteJobs = action.payload
       }
       ),
       setJobApplications:((state,action)=>{
        state.jobapplications = action.payload
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



export const {setJobPost,setJobPosts,setScreen,setSearchJSQuery,setSearchJSTerm,setJobApplications,setfavouriteJobs
} = jobsSlice.actions

export default jobsSlice.reducer;






