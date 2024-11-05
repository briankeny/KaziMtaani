import Toast from '@/kazisrc/components/Toast'
import { logo } from '@/kazisrc/images/images'
import { useGetResourceMutation } from '@/kazisrc/store/services/authApi'
import { setUserSections, setUserSkills } from '@/kazisrc/store/slices/authSlice'
import { clearModal} from '@/kazisrc/store/slices/modalSlice'
import { useAppDispatch } from '@/kazisrc/store/store'
import { globalstyles } from '@/kazisrc/styles/styles'
import { formatDate, formatDateToString } from '@/kazisrc/utils/utils'
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect} from 'react'
import { SafeAreaView, View,Image,Text,TouchableOpacity,Pressable, ScrollView, RefreshControl } from 'react-native'
import { useSelector } from 'react-redux'

export default function UserProfileScreen () {
    const dispatch = useAppDispatch() 
    const { theme} = useSelector((state: any) => state.theme)
    const { userData ,userSkills,userSections} = useSelector((state: any) => state.auth)
    const [getData,{isLoading: getLoading}] = useGetResourceMutation({fixedCacheKey:'User_Skills'})
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    )
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        router.replace("/(app)/(profile)");
      }, 2000);
    }, [router]);
  
   
    function closeModal() {
      dispatch(clearModal())
      return true
    }

    
    async function fetchUserSkills(){
      try{
        const resp =  await getData({endpoint:`/user-skills/?search=${userData.user_id}`}).unwrap()
        if(resp){
          const data = resp?.results ? resp.results : []
          dispatch(setUserSkills(data))
        }
      }
      catch(error){
      }
    } 

    async function fetchUserSections(){
      try{
        const resp =  await getData({endpoint:`/user-info/?search=${userData.user_id}`}).unwrap()
        if(resp){
          const data = resp?.results ? resp.results : []
          dispatch(setUserSections(data))
        }
      }
      catch(error){
      }
    } 
    
  useEffect(()=>{
    fetchUserSkills()
  },[])
  
  useEffect(()=>{
    fetchUserSections()
  },[])

  return (
    <SafeAreaView
    style={[globalstyles.safeArea, { backgroundColor: theme.background}]}
  >
   <ScrollView  refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
   
   <View  style={[{elevation:2,padding:2}]}>
    <View style={{
    width:200,
    height:200,
    marginVertical:10,
    overflow:'hidden',
    borderRadius:100,
    backgroundColor:'orange',
      alignSelf:'center'
    }}>
      {userData?.profile_picture ?
        <Image 
        style={{width:200,height:200,borderRadius:100,objectFit:'cover'}}
         source={{uri:userData.profile_picture}}
        />:
         <View style={[globalstyles.columnCenter,
      {width:200,height:200, borderRadius:100,overflow:'hidden',
      backgroundColor:'rgb(255,123,23)'}]}>
        <Text style={[
        {fontFamily:'Poppins-ExtraBold',fontSize:100,color:'#fff',textAlign:'center'}]}>
        {userData?.full_name?.slice(0,1)}
        </Text>
    </View>
    }
    </View>

    <View>
      <Text 
      style={{
        color:theme.text,
        fontFamily:'Poppins-Bold',
        fontSize:23,
        textAlign:'center'
      }}
      >
          {userData.full_name}
      </Text>
      <Text 
      style={{
        color:'#999',
        fontFamily:'Poppins-Regular',
        fontSize:9,
        textAlign:'center'
      }}
      >
        @{userData.username}
      </Text>
    </View>

    <TouchableOpacity
            style={{ position: "absolute", right: 30, top:250 }}
            onPress={()=>router.push('/(app)/(profile)/edit')}
          >
            <AntDesign name="edit" size={24} color="green" />
    </TouchableOpacity>

    <Text style={{color:theme.text,textAlign:'center',padding:10}}>
          {userData?.industry}
    </Text>
    <Pressable 
      onPress={()=>router.push('/(app)/(profile)/add-section')}
      style={
        [globalstyles.rowEven,
        {borderWidth:1,
        width:'60%',marginVertical:10, alignSelf:'center',padding:5,
        borderStyle:'dotted', borderColor:'green'}]}>
          <Text style={{color:theme.text}}>
              Add a custom section
          </Text>
          <AntDesign name="plussquare" size={24} color={'green'} />
      </Pressable>
    
    </View>

    <View style={[globalstyles.card,{backgroundColor:theme.card,elevation:2,marginVertical:2}]}>
        <Text style={{
          color:theme.text,
          fontFamily:'Poppins-Bold',
          fontSize:17
        }}>
          Bio
        </Text>

        <Text style={{color:theme.text}}>
          {userData.bio}
        </Text>
        
    </View>

    
   {userData.account_type != 'recruiter' &&
    <View style={[globalstyles.card,{backgroundColor:theme.card,elevation:2,marginVertical:2}]}>
        <Text style={{
          color:theme.text,
          fontFamily:'Poppins-Bold',
          fontSize:17
        }}>
          My Skills
        </Text>
        <View style={[globalstyles.row,{gap:5,flexWrap:'wrap'}]}>
          {userSkills && userSkills.length >0 && userSkills.map((item:any,index:number)=>
           <View 
           key={index}
           style={[globalstyles.rowEven]}>
           <Entypo name="dot-single" size={24} color={theme.text} />
           <Text
            style={{color:theme.text,paddingRight:10}}>
            {item.skill_name}
          </Text>
          </View>
          )} 
          {userSkills && userSkills.length == 0 && 
            <Text style={{color:'#999'}}>
              You have not added any skill yet. Click on the plus button to add a skill.
            </Text>
          } 
        </View>

        <Pressable onPress={()=>
          router.push('/(app)/(profile)/edit-skill')
        } style={[globalstyles.row,{position:'absolute',top:10,right:10,gap:10}]} >
             <MaterialIcons name="edit" size={24} color={theme.text} />
             <MaterialIcons name="add" size={24} color={theme.text} />
        </Pressable>

    </View>
    }

    
    { userSections && userSections.length  > 0 &&
     userSections.map((item:any,index:number)=>{
      const start_date = item.start_date ? formatDateToString(item.start_date) :''
      const end_date = item.end_date ? formatDateToString(item.end_date): ''
      return(
      <View
      key={index}
      style={[globalstyles.card,{backgroundColor:theme.card,elevation:2,marginVertical:2}]}>
        
        <Pressable 
        onPress={()=>router.push({pathname:'/(app)/(profile)/edit-section',params:{sectionid:item.id} })}
        style={{position:'absolute',right:5,top:5}}>
        <Entypo name="edit" size={21} color={theme.text} />
        </Pressable>
        
        {item.subject &&
        <Text style={{
          color:theme.text,
          fontFamily:'Poppins-Bold',
          fontSize:17
        }}>
          {item?.subject}
        </Text>
        }
        <Text style={{color:'rgba(0,105,0,0.9)',fontFamily:'Nunito-Bold',fontSize:16,paddingVertical:3}}>
          {item.title}
        </Text>
        <Text style={{color:theme.text}}>
          {item.description}
        </Text>

        <View style={[globalstyles.row,{alignSelf:'center',width:'100%',paddingTop:5}]}>
          {item.start_date &&
        <Text style={{color:'#999',fontFamily:'SpaceMono-Regular'}}>{start_date} - </Text>}
           {item.end_date && 
        <Text style={{color:'#999',fontFamily:'SpaceMono-Regular'}}>{end_date}</Text>}
        </View>
      
    </View>)}
     )
     }


    </ScrollView>


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

