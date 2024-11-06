import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchPeopleSQuery : '',
    searchPeopleSTerm : 'full_name',
    searchPeoplefilters:  [],
    searchPeopleHistory:[]
}

const peopleSlice = createSlice({
    name:'people',
    initialState,
    reducers: {
       setPeopleSQuery:((state,action)=>{
        state.searchPeopleSQuery = action.payload
       }),
       setPeopleSTerm : ((state,action)=>{
        state.searchPeopleSTerm = action.payload
       }),
       setPeopleHistory : ((state,action)=>{
        state.searchPeopleHistory = action.payload
       }),

    }
})



export const {setPeopleSQuery,setPeopleSTerm,setPeopleHistory
} = peopleSlice.actions

export default peopleSlice.reducer;
