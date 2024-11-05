import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobposts:  [],
    jobapplications:  [],
    jobApplication:{},
    jobpost:{},
    favouriteJobs : <any>[],
    screen:'',
    searchJSQuery : '',
    searchJSTerm : 'title',
    searchfilters:  []
}

const jobsSlice = createSlice({
    name:'jobs',
    initialState,
    reducers: {
       setJobPosts:((state,action)=>{
        state.jobposts = action.payload
       }),
       setFavouriteJobs : ((state,action)=>{
        state.favouriteJobs = action.payload
       }
       ),
       setJobApplications:((state,action)=>{
        state.jobapplications = action.payload
       }),
       setJobApplication:((state,action)=>{
        state.jobApplication = action.payload
       }),
       setJobPost:((state,action)=>{
        state.jobpost = action.payload
       }),
       setScreen:((state,action)=>{
        state.screen = action.payload
       }),
       setSearchJSQuery:((state,action)=>{
        const input = action.payload
        state.searchJSQuery = input.trim()
       }),
       setSearchJSTerm:((state,action)=>{
        state.searchJSTerm = action.payload
       })
    }
})



export const {setJobPost,setJobPosts,setScreen,
    setJobApplication,
    setSearchJSQuery,setSearchJSTerm,setJobApplications,setFavouriteJobs
} = jobsSlice.actions

export default jobsSlice.reducer;






