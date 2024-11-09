import { Checkmark } from "@/kazisrc/components/Checkmark";
import { Loading } from "@/kazisrc/components/Loading";
import Toast from "@/kazisrc/components/Toast";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { clearModal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, Text, View,Image, ScrollView, FlatList, RefreshControl } from "react-native";
import { useSelector } from "react-redux";

export default function  PeopleScreen () {
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector((state: any) => state.modal);
    const [getUserData, { isLoading,data, isError, error, isSuccess }] = useGetResourceMutation({fixedCacheKey:'people_search'});
    const {userData} = useSelector((state:any)=>state.auth)
    const [people, setPeople] = useState<any>([])
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {    
        setRefreshing(false);
      }, 2000);
    }, [router]);

    function closeModal() {
      dispatch(clearModal());
      return true;
    }


    useEffect(()=>{
     data && setPeople(data.results)
    },[data])

   
function PeopleCard({person}:any){

  return( 
  <TouchableOpacity 
   onPress={()=>router.push({
    pathname:'/(app)/(search)/(people)/user-profile',
    params:{user_id:person.user_id}
  })} 
 
  style={{backgroundColor:theme.card,paddingVertical:10,paddingHorizontal:20,
    borderBottomWidth:0.2, borderBottomColor:'#999' , width:'100%',overflow:'hidden'
  }}>
    
    {userData.user_id == person.user_id &&
    <View style={[globalstyles.columnCenter,{position:'absolute',right:10,top:5, 
      borderRadius:20, width:40 ,height:22,
    backgroundColor:'rgba(31, 61, 122,0.7)'}]}>
        <Text style={{color:'#fff',fontWeight:'600'}}>You</Text>
    </View> 
    }

    <View style={[globalstyles.row,{gap:10}]}>
      <View style={{
          height:60,
          width:60,
          borderRadius:30
        }}>
          
          { person?.profile_picture ?
            <Image style={{height:60, width:60,borderRadius:30}} source={{uri:person.profile_picture}}/>
            :
            <CustomUserAvatar
            name={person.full_name}
            />
          }
         
        </View>
        
        <View style={[globalstyles.column,{width:'60%',overflow:'hidden'}]}>
            <View style={[globalstyles.row,{gap:10}]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize:17,
                fontFamily:'Nunito-Bold',
                color: theme.text,
              }}
            >
              {person?.full_name}
            </Text>
                <Checkmark
                tier={person.verification_badge}
                size={20}
                issuperuser={person.is_superuser}
                />
            </View>
            <Text 
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "#888",fontSize: 10 }}>
            @{person.username}
            </Text>

            {person.industry &&
            <Text style={{color:theme.text, fontSize:14,paddingVertical:8}}>
              {person.industry}</Text>}
        </View>
        
        <View style={[globalstyles.columnCenter,{width:'20%'}]}> 
            <Text style={{color:person.account_type == 'recruiter' ? 'rgba(0,105,0,0.7)':
              '#999',textTransform:'capitalize'}}>
              {person.account_type}
            </Text>
        </View>

    </View>
      
  </TouchableOpacity>)
}

    return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
      { isLoading ?
        <Loading/>:
      people && people.length > 0 ? 
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          data={people}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: { item: any; index: number }) => {
     
            return (
             <PeopleCard person={item} />
            );
          }}
        />
      : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={[globalstyles.columnCenter, { height: "100%",paddingTop:'50%'}]}>
            <Text style={{ color: theme.text }}>0 Results found</Text>
          </View>
        </ScrollView>
      )}
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





export function CustomUserAvatar({name}:{name:string}){
  return(
    <View style={[globalstyles.columnCenter,
      {width:60,height:60, 
      borderRadius:30,overflow:'hidden',
      backgroundColor:'gray'}]}>
        <Text style={[
        {fontFamily:'Poppins-ExtraBold',fontSize:20,color:'#fff',textAlign:'center'}]}>
        {name.slice(0,1)}
        </Text>
    </View>
  )
}
