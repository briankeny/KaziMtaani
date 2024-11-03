import React, { useEffect, useState } from 'react';
import { SafeAreaView, View,Text, TouchableOpacity,Image, Pressable, RefreshControl, ScrollView, Dimensions} from 'react-native'
import { useDeleteResourceMutation, useGetResourceMutation, usePostResourceMutation } from '@/kazisrc/store/services/authApi';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { useSelector } from 'react-redux';
import Toast from '@/kazisrc/components/Toast';
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice';
import { HomeMenuProps } from '@/kazisrc/types/types';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import ParallaxScrollView from '@/kazisrc/components/ParallaxScrollView';
import { setFavouriteJobs } from '@/kazisrc/store/slices/jobsSlice';
import { router } from 'expo-router';

export default function JobProfileScren() {
  const dispatch = useAppDispatch();
  const {userData} = useSelector((state:any)=>state.auth)
  const {jobpost,favouriteJobs} = useSelector((state:any)=>state.jobs)
  const {post_id} = jobpost
  const { theme} = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const [jobapplicants , setJobApplicants] = useState<any>([])
  const [userIsApplicant ,setUserIsApplicant] = useState<boolean>(false)
  const [getData, {isLoading,isSuccess,isError,error}] = useGetResourceMutation();
  const [postData, {isLoading:postLoading,isError:existsPostError,error:postError}] = usePostResourceMutation();
  const [deleteData, { isLoading: delLoading }] = useDeleteResourceMutation();
  
  const [isFavourite,setIsFavourite] = useState<boolean>(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      router.replace("/(app)/(jobs)/job-profile");
    }, 2000);
  }, [router]);

  async function fetchJobApplications() {
    if(!isLoading){
    try{
      const resp =  await getData({endpoint:`/job-applications/?jobpost=${post_id}`}).unwrap()
      if(resp){
        setJobApplicants(resp?.results)
        // dispatch(setJobPost(data))
      }
    }
    catch(error:any){
    }
  }
  }

  async function cancelApplication() {
    if (!delLoading && userIsApplicant) {
      try {
        const application_details:any = jobapplicants.filter((item:any)=> item.applicant === userData.user_id)
        const item = application_details[0]
        if(item){
        await deleteData({
          endpoint: `/job-application/${item["id"]}/`,
        })
          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "Application has been cancelled!",
          });
        setUserIsApplicant(false)
        fetchJobApplications()
      }
      } catch (error: any) {
        rendermodal({
          dispatch: dispatch,
          header: "Error!",
          status: "error",
          content: "Could not cancel application. Please try again later",
        });
      }
    }
  }
  

  //Toggle Modal
  function closeModal(){
    dispatch(clearModal())
  }

  function checkIfUserApplicant(list:any){
    try{
      const existUser = list.find((item:any)=> item.applicant == userData.user_id) !== undefined

      existUser && setUserIsApplicant(true)
    }
    catch(err){
      setUserIsApplicant(false)
    }
  }
  
  async function applyJob() {
    if(!postLoading){
    try{
      const data = {applicant:userData.user_id, jobpost:post_id}
      const resp = await postData({data:data,endpoint:`/job-application-create/`}).unwrap()
      if(resp){
        rendermodal({
          dispatch: dispatch,
          header: "Success!",
          status: "success",
          content: 'Your job application has been received.🎉',
        })
        fetchJobApplications()
      }
    }
    catch(error:any){
      rendermodal({
        dispatch: dispatch,
        header: "Error!",
        status: "error",
        content: 'Oops! An error occurred while trying to apply the job',
      })
    }}
  }

  useEffect(()=>{
    post_id && fetchJobApplications()
  },[post_id])

  useEffect(()=>{
    jobapplicants && checkIfUserApplicant(jobapplicants)
  },[jobapplicants])

  function checkFavJobs(favouriteJobs:any){
    const isfav =  favouriteJobs.find((item:any)=>item.post_id = jobpost.post_id) !== undefined
    if(isfav){
      setIsFavourite(true)
    }
    else{
      setIsFavourite(false)
    }
  }

  function toggleFavJobs(){
    const isfav = favouriteJobs.find((item:any)=>item.post_id === jobpost.post_id) !== undefined
    if(isfav){
      const latest = favouriteJobs.filter((item:any)=>item.post_id != jobpost.post_id)
      dispatch(setFavouriteJobs(latest))
      setIsFavourite(false)
    }  
    else{
      let updated = [...favouriteJobs,jobpost]
      dispatch(setFavouriteJobs(updated))
      setIsFavourite(true)
    } 
  }

  useEffect(()=>{
   favouriteJobs && checkFavJobs(favouriteJobs)
  },[favouriteJobs])


  useEffect(()=>{
   if (isError){
      rendermodal({
        dispatch: dispatch,
        header: "Network Error!",
        status: "error",
        content: 'You are currently offline',
      })
    }
  },[isError])

  function CardInfo( 
    {Icon,
    // onPress= ()=>void,
    iconSize = 24,
    iconColor = "#888",
    contentTextColor='',
    headerTextColor='#fff',
    header = "",
    content = "",
    iconName = "",
    backColor = ""}:HomeMenuProps){
    return(
      <View style={[globalstyles.card,globalstyles.rowEven,
      {backgroundColor:theme.card,elevation:1, width:'45%'}]}>
             <Icon
              style={[{ position: "absolute", left:10, top:20 }]}
              name={iconName}
              size={iconSize}
              color={iconColor}
            />
  
              <View style={[globalstyles.column]}>
              <Text style={[ { color:theme.text,fontSize:16,textAlign:'center',
              fontFamily:'Poppins-Bold' }]}>
                {header}
              </Text>
                <Text style={[{ color: contentTextColor? contentTextColor: '#999',fontSize:12,fontWeight:600 }]}>
                  {content}
                </Text>
             
            </View>
      </View>
    )
  }

  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ 
      backgroundColor: theme.background,height:Dimensions.get('window').height }]}>

<ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
    
  

      <View style={[globalstyles.rowEven,{top:40, position:'absolute',width:'100%',zIndex:1}]}>
       
      <Pressable 
      onPress={()=>router.back()}>
        <AntDesign name="back" size={30} color={'#fff'} />
       </Pressable>
       
        <Text
        style={{color:'#fff',fontSize:21,fontFamily:'Poppins-Bold',textAlign:'center'}}
        ellipsizeMode='tail'
        numberOfLines={1}
        >
          {jobpost?.recruiter?.full_name}
        </Text>

        <Pressable onPress={toggleFavJobs}>
          <FontAwesome name={ isFavourite? "heart" :"heart-o"} size={24} color="orange" />
        </Pressable>
        
      </View>
      
     
      <ParallaxScrollView 
      theme={theme}
      >
        {jobpost?.job_picture ?
         <Image
         style={{height:'100%', width:'100%',objectFit:'cover'}}
        source={{uri:jobpost.job_picture}}
        />
        :
        <View style={{width:'100%',height:'100%', backgroundColor:'rgba(0,105,0,0.5)'}}>
          
        </View>
        }
        
      </ParallaxScrollView>
          
      <View style={[globalstyles.column,{
        borderTopLeftRadius:20,borderTopRightRadius:20, 
        backgroundColor:theme.card,elevation:2,marginTop:-20
        }]}>
            
            <View style={[globalstyles.column,{paddingTop:20}]}>
              <Text style={{color:theme.text,fontSize:20,
                textAlign:'center',
                fontFamily:'Poppins-Bold'}}>{jobpost.title}</Text>
            </View>

            <View style={[globalstyles.row,{alignSelf:'center'}]}>
              <Text 
                ellipsizeMode='tail'
                numberOfLines={1}
                style={{color:'#999',
                  fontSize:11,
                  textTransform:'capitalize',
                textAlign:'center'
              }}>{jobpost?.experience_level}</Text>

            </View>

          <View style={[globalstyles.rowEven]}>
              <CardInfo
                   header="Sallary"
                   content={jobpost.salary_range}
                   backColor={theme.card}
                  
                   iconColor="rgb(16, 90, 20)"
                   iconSize={21}
                   iconName="money"
                   Icon={FontAwesome}
              />

                <CardInfo
                   header="Job Type"
                   content={jobpost.employment_type}
                   backColor={theme.card}
                   iconColor="rgb(106, 90, 205)"
                   iconSize={21}
                   iconName="briefcase"
                   Icon={FontAwesome}
              />
          </View>

          <View style={[globalstyles.column,{padding:20}]}>
            <Text style={{color:theme.text,fontFamily:'Poppins-Bold'}}>Job Details</Text>
            <Text style={{color:theme.text,lineHeight:21}}>{jobpost?.description}</Text>
          </View>
      </View>
      <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
      </ScrollView>
     
      <View style={[globalstyles.rowWide,{paddingHorizontal:20,position:'absolute',bottom:5,width:'100%'}]}>

            <View style={[globalstyles.column]}>
              <Text style={{color:theme.text,fontSize:11}}>Applicants</Text>
              <Text style={{color:theme.text,fontFamily:'Poppins-Bold'}}>{
              jobapplicants.length}</Text>
            </View>
            
            {!isLoading &&
            <TouchableOpacity 
            style={{
              minWidth:150,
              height:40,
              paddingHorizontal:10,
              borderRadius:20,
              backgroundColor: userIsApplicant ? 'red': 'green'
            }}
            onPress={ userIsApplicant ? cancelApplication:
              applyJob}>
                <Text style={{color:'#fff',
                  paddingTop:8, fontSize:18,fontWeight:'500',
                  paddingHorizontal:2,textAlign:'center'}}>
                   { userIsApplicant ? 'Cancel Application':
                    'Apply Job'}</Text>
            </TouchableOpacity>}

          </View>
    </SafeAreaView>
  )
}

