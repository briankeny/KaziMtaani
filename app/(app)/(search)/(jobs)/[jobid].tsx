import React, { useEffect, useState } from 'react';
import { SafeAreaView, View,Text, TouchableOpacity,Image, Pressable} from 'react-native'
import { useGetResourceMutation, usePostResourceMutation } from '@/kazisrc/store/services/authApi';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { useSelector } from 'react-redux';
import Toast from '@/kazisrc/components/Toast';
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice';
import { HomeMenuProps } from '@/kazisrc/types/types';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import ParallaxScrollView from '@/kazisrc/components/ParallaxScrollView';
import { setfavouriteJobs } from '@/kazisrc/store/slices/jobsSlice';

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
  const [getData, {}] = useGetResourceMutation();
  const [postData, {}] = usePostResourceMutation();

  const [isFavourite,setIsFavourite] = useState<boolean>(false)

  async function fetchJobApplications() {
    try{
      const resp =  await getData({endpoint:`/job-applications/?jobpost=${post_id}&applicant=${userData.user_id}/`}).unwrap()
      if(resp){
        setJobApplicants(resp?.results)
        // dispatch(setJobPost(data))
      }
    }
    catch(error:any){
    }
  }

  //Toggle Modal
  function closeModal(){
    dispatch(clearModal())
  }
  
  async function applyJob() {
    try{
      const data = {applicant:userData.user_id, jobpost:post_id}
      const resp = await postData({data:data,endpoint:`/job-applications/`})
      if(resp){
        rendermodal({
          dispatch: dispatch,
          header: "Success!",
          status: "success",
          content: 'Your job application has been received.🎉',
        })
      }
    }
    catch(error:any){
      rendermodal({
        dispatch: dispatch,
        header: "Error!",
        status: "error",
        content: 'Oops! Something went wrong',
      })
    }
  }

  useEffect(()=>{
    post_id && fetchJobApplications()
  },[post_id])


  function checkFavJobs(){
    const isfav = favouriteJobs.find((item:any)=>item.post_id = jobpost.post_id)
    if(isfav){
      setIsFavourite(true)
    }
    else{
      setIsFavourite(false)
    }
  }

  function toggleFavJobs(){
    const isfav = favouriteJobs.find((item:any)=>item.post_id == jobpost.post_id)
    if(isfav){
      const latest = favouriteJobs.filter((item:any)=>item.post_id == jobpost.post_id)
      dispatch(setfavouriteJobs(latest))
    }  
    else{
      const latest = [...favouriteJobs,jobpost]
      dispatch(setfavouriteJobs(latest))
    } 
  }

  useEffect(()=>{
    checkFavJobs()
  },[favouriteJobs])

  function CardInfo( 
    {Icon,
    // onPress= ()=>void,
    iconSize = 24,
    iconColor = "#888",
    contentTextColor="#fff",
    headerTextColor='#fff',
    header = "",
    content = "",
    iconName = "",
    backColor = ""}:HomeMenuProps){
    return(
      <View style={[globalstyles.card,globalstyles.rowEven,
      {backgroundColor:theme.card,elevation:1, width:'45%'}]}>
             <Icon
              style={[{ position: "absolute", right: 25, top:10 }]}
              name={iconName}
              size={iconSize}
              color={iconColor}
            />
  
              <View style={[globalstyles.column]}>
                <Text style={[{ color:'#999',fontSize:12,fontWeight:600 }]}>
                  {content}
                </Text>
              <Text style={[ { color:theme.text,fontSize:16,paddingVertical:5,fontFamily:'Poppins-Bold' }]}>
                {header}
              </Text>
            </View>
      </View>
    )
  }




  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
      
      <View style={[globalstyles.rowEven,{top:10, position:'absolute'}]}>
        <AntDesign name="back" size={24} color="black" />
        <Text
        style={{color:'#fff',fontSize:21,fontWeight:'500',textAlign:'center'}}
        ellipsizeMode='tail'
        numberOfLines={1}
        >
          {jobpost?.recruiter?.full_name}
        </Text>

        <Pressable onPress={toggleFavJobs}>
          <FontAwesome name={ isFavourite? "heart" :"heart-o"} size={24} color="red" />
        </Pressable>
        
      </View>
      
      <ParallaxScrollView 
      theme={theme}
      >
        {jobpost.postimage ?
         <Image
         style={{height:'100%', width:'100%', objectFit:'cover',aspectRatio:4/3}}
        source={{uri:jobpost.postimage}}
        />
        :
        <View style={{height:'100%', width:'100%',backgroundColor:'green'}}>
        </View>
        }
        
      </ParallaxScrollView>
          
      <View style={[globalstyles.column,{borderTopLeftRadius:20, borderTopRightRadius:20}]}>
            
            <View style={[globalstyles.column,{padding:10}]}>
              <Text style={{color:theme.text,
                textAlign:'center',
                fontFamily:'Poppins-Bold'}}>{jobpost.title}</Text>
            </View>

            <View style={[globalstyles.row,{alignSelf:'center',paddingVertical:4}]}>
              <Text 
                ellipsizeMode='tail'
                numberOfLines={1}
                style={{color:'#999',
                  fontSize:11,
                textAlign:'center'
              }}>{jobpost?.recruiter?.username}</Text>

            </View>

          <View style={[globalstyles.rowEven]}>
              <CardInfo
                   header="Sallary"
                   content={jobpost.salary_range}
                   backColor={theme.card}
                   iconColor="rgb(106, 90, 205)"
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

          <View style={[globalstyles.column]}>
            <Text style={{color:theme.text,fontFamily:'Poppins-Bold'}}>Job Details</Text>
            <Text style={{color:theme.text}}>{jobpost?.description}</Text>
          </View>

          <View style={[globalstyles.rowWide, {position:'absolute',bottom:0}]}>
            
            <View style={[globalstyles.column]}>
              <Text style={{color:theme.text,fontSize:11}}>Applicants</Text>
              <Text style={{color:theme.text,fontSize:11,fontFamily:'Poppins-Bold'}}>{jobapplicants.length}</Text>
            </View>
            
            <TouchableOpacity onPress={applyJob}>
                <Text style={{color:theme.text}}>Apply</Text>
            </TouchableOpacity>

          </View>
      </View>

      <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
    </SafeAreaView>
  )
}

