import Toast from "@/kazisrc/components/Toast";
import { logo } from "@/kazisrc/images/images";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { setJobPost, setJobPosts } from "@/kazisrc/store/slices/jobsSlice";
import { clearModal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateDifferenceWithUnit, dateFormater } from "@/kazisrc/utils/utils";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";

export default function JobPostsScreen() {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { jobposts } = useSelector((state: any) => state.jobs);
  const [getData, { isLoading, isError, error, isSuccess }] =useGetResourceMutation({fixedCacheKey:'jobs_search'});
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      router.replace("/(app)/(search)/");
    }, 2000);
  }, [router]);

  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  
  async function fetchJobPosts() {
    try {
      const resp: any = await getData({ endpoint: "/job-posts/" }).unwrap();
     
      if (resp) {
        dispatch(setJobPosts(resp.results));
      }
    } catch (error: any) {}
  }

  function goToPost(item:any){
    dispatch(setJobPost(item))
    router.push('/(app)/(jobs)/job-profile')
  }

  function closeModal() {
    dispatch(clearModal());
    return true;
  }
  
  useEffect(()=>{
    fetchJobPosts()
  },[])

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    > 
    { jobposts && jobposts.length > 0 ?
      <FlatList
        refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={(item,index) =>index.toString() }
        data={jobposts}
        renderItem={({ item, index }: { item: any; index: number }) => {
          const timeposted = dateDifferenceWithUnit(item.date_posted);
          const {dat,time} = dateFormater(item.deadline_date)

          return(
          <JobCard item={item}
           goToPost={()=>goToPost(item)} 
          timeposted={timeposted} dat={dat}  time={time} theme={theme} key={index} />
        )}}
      />
     :
     <ScrollView
     refreshControl={
       <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
     }
   >
     <View style={[globalstyles.columnCenter,{height:'100%',paddingTop:'50%'}]}>
        <Text style={{color:theme.text}}>0 Jobs Found</Text>
     </View>
    </ScrollView>
    }
    <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
    </SafeAreaView>
  );
}

export function JobCard({ item, theme,time,timeposted,dat ,goToPost}: any) {
 

  return (
    <TouchableOpacity
     onPress={goToPost}
      style={[
        globalstyles.card,
        { width:'95%',
          backgroundColor: theme.card,
          marginVertical:5,
          elevation:3
        },
      ]}
    >
      <View style={[globalstyles.rowWide,{overflow:'hidden'}]}>

        <View style={[globalstyles.row, { gap: 10, overflow:'hidden',width:'80%'}]}>

          {item?.recruiter?.profile_picture ? 
          <Image
            source={{uri:item.recruiter.profile_picture}}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          :
          <View
          style={[
            globalstyles.columnCenter,
            {
              width: 50,
              height: 50,
              borderRadius: 25,
              overflow: "hidden",
              backgroundColor: "rgb(255,123,23)",
            },
          ]}
        >
          <Text
            style={[
              {
                fontFamily: "Poppins-ExtraBold",
                fontSize: 20,
                color: "#fff",
                textAlign: "center",
              },
            ]}
          >
            {item?.recruiter?.full_name?.slice(0, 1)}
          </Text>
        </View>
        }

          <View style={[globalstyles.column,{overflow:'hidden'}]}>
            <Text 
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[{ color: theme.text, fontFamily:'Poppins-Bold' }]}>
           {item?.recruiter?.full_name}
            </Text>
       
            <Text 
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "#888", fontSize: 10 }}>
              @{item?.recruiter?.username}
            </Text>
          </View>

        </View>

        <View style={[globalstyles.column]}>
          <Text style={[{ color: theme.text, fontSize: 11 }]}>{timeposted}</Text>
        </View>
      </View>

      <Text 
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[{ color: theme.text,textAlign:'center', fontFamily:'Poppins-Bold' }]}>
          {item.title}
          </Text>

      <View style={[globalstyles.rowWide,{width:'100%',paddingVertical:5}]}>

        <View style={[globalstyles.column ,{width:'70%'}]}>
          <Text style={[{ color: theme.text,fontSize:11}]}>
            Sallary
          </Text>
          <Text
            numberOfLines={1}
            style={[{ color: 'green',paddingVertical:3, fontFamily:'Poppins-Bold'}]}
            ellipsizeMode="tail"
          >
            {item?.salary_range}
          </Text>
        </View>
        
        <View style={[globalstyles.columnEnd,{width:'30%'}]}>
            <Text style={{color:theme.text,fontSize:11}}>Status</Text>
            <Text
            style={{
              paddingVertical:3,
              color: item.status == 'open'? 'orange' : 'red',
              fontFamily:'Poppins-Bold'
            }}
            >{item?.status}</Text>
        </View>
      </View>

      <View style={[globalstyles.rowWide,{marginVertical:10}]}>
        
        <View style={{backgroundColor:  'rgba(0,0,0,0.1)',borderRadius:15}}>
        <Text style={[{ color: theme.text, fontSize: 11,textTransform:'capitalize',padding:4 }]}>
        {item?.employment_type}</Text>
        </View>
      
        <View style={{backgroundColor:  'rgba(0,0,0,0.1)',borderRadius:15}}>
        <Text style={[{ color: theme.text, fontSize: 11,textTransform:'capitalize',padding:4 }]}>
          {item?.experience_level}</Text>
        </View>

          <Text style={[{ color: theme.text,fontSize: 11 }]}>{item?.location}</Text>   
     
      </View>

      <Text style={[{ color:'#888',fontSize: 11,position:'absolute',right:10 ,bottom:10 }]}>
        {
        dat}{' '}{time}</Text>  

    
    </TouchableOpacity>
  );
}
