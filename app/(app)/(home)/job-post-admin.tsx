import { useGetResourceMutation } from '@/kazisrc/store/services/authApi';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import React, { useEffect } from 'react'
import { FlatList, SafeAreaView, View,Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import { setJobPosts } from '@/kazisrc/store/slices/jobsSlice';

export default function JobPostsAdminScreen (){
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );
    const { jobposts,jobpost } = useSelector((state: any) => state.jobs);
    const [getData, { data, isLoading, isError, error, isSuccess }] = useGetResourceMutation({fixedCacheKey:'my-jobs'});

    async function fetchJobAps() {
        try {
          const resp = await getData({ endpoint: "/job-posts/" }).unwrap();
          if (resp) {
            const data = resp.results ? resp.results : [];
            const arr = [...jobposts, ...data];
            const cleaned = [...new Set(arr)];
    
            dispatch(setJobPosts(cleaned));
          }
        } catch (error: any) {}
      }
    
      useEffect(() => {
        fetchJobAps();
      }, []);

    return (
        <SafeAreaView
          style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
        >
          { jobposts && jobposts.length > 0 ?
          <FlatList
            keyExtractor={(item) => item.advert_id.toString()}
            data={jobposts}
            renderItem={({ item, index }: { item: any; index: number }) => (
              <JobPostCard item={item} theme={theme} key={index} />
            )}
          />
        : 
         <View style={[globalstyles.columnCenter,{height:'100%'}]}>
            <Text style={{color:theme.text,textAlign:'center'}}>Found 0 job posts</Text>
         </View>
        }
        </SafeAreaView>
      )
}



export function JobPostCard({item,theme}:any){
  return(
    <TouchableOpacity>

    </TouchableOpacity>
  )
}