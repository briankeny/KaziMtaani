
import Swipper from '@/kazisrc/components/Swipper';
import { useGetResourceMutation } from '@/kazisrc/store/services/authApi';
import { setJobPosts } from '@/kazisrc/store/slices/jobsSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import React, { useEffect, useRef } from 'react'
import { SafeAreaView, View,Text } from 'react-native';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
    const dispatch = useAppDispatch()
    const swipeableRowRef = useRef<any>(null)    
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const {jobs} =  useSelector((state:any)=>state.jobs)
    const [getData, { isLoading,isError,error,isSuccess}] = useGetResourceMutation();
 
    async function fetchJobPosts() {
        try{
          const resp:any = await getData({endpoint:'/job-posts/'}).unwrap()
          if(resp){
            const list  = [...jobs, resp.results]
            const updt_jobs = [... new Set(list)]
            dispatch(setJobPosts(updt_jobs))
          }
        }
        catch(error:any){
        }
    }


   useEffect(()=>{
     fetchJobPosts()
   },[])

//    function RenderJobs(){
//     return(
//         <FlatList
//         keyExtractor={(item)=> item.advert_id.toString()}
//         data={jobexamples}
//         renderItem={
//           ({item,index}:{item:any,index:number})=>
//             <JobCard
//             item={item}
//             theme={theme}
//             key={index}
//             />
//         }
//       />
//     )
//    }
    
  return (
          <SafeAreaView
        style={[globalstyles.safeArea, { backgroundColor: theme.background}]}
      >
        <View style={[ globalstyles.column,{height:'100%',width:'100%'}]}>
        <Swipper
        initialPage={0}
        swipperStyles={{height:'100%',width:'100%',flex:1}}
        setPage={()=>console.log('yes')}>
            
            <Text style={{color:theme.text,textAlign:'center'}} key="1">Hello</Text>
            <Text style={{color:theme.text}} key="2" >Hello brother</Text>
        </Swipper>
        </View>
       
        </SafeAreaView>
  )
}

export default HomeScreen
