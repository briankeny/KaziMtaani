import BottomSheetDrawer from "@/kazisrc/components/BottomSheetDrawer";
import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { Loading } from "@/kazisrc/components/Loading";
import NotFound from "@/kazisrc/components/NotFound";
import Toast from "@/kazisrc/components/Toast";
import { useGetResourceMutation, usePatchResourceMutation } from "@/kazisrc/store/services/authApi";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateFormater } from "@/kazisrc/utils/utils";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useMemo, useRef } from "react";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  View,Image,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";

export default function  AdminJobselectedItemsScreen () {
  const dispatch = useAppDispatch();
  const params: any = useGlobalSearchParams();
  const { post_id } = params;
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector((state: any) => state.modal);
  const [getData, { data, isLoading, isError, error, isSuccess }] = useGetResourceMutation({ fixedCacheKey: "jobs_search" });
  const [patchData, { isLoading:patchLoading,isError:patchError}] = usePatchResourceMutation();
  const [jobapplications, setJobApplications] = useState([]);
  const [selectedItem ,setselectedItem] = useState<any>({})
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(false);
  const snapPoints = useMemo(() => [ "10%", "25%", "50%"], []);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchJobApplications(post_id)
    }, 2000);
  }, []);
  
  //Toggle Modal
  function closeModal(){
    dispatch(clearModal())
  }

  function openDialogue(item:any){
    setselectedItem(item)
    setOpenBottomSheetDrawer(true)
  }

  async function performAction(data:any){
    if(!patchLoading){
      setOpenBottomSheetDrawer(false);
      try{
        const resp = await patchData({data:data , endpoint:`/job-application/${selectedItem.id}/`}).unwrap()
        if(resp)
        rendermodal({
          dispatch: dispatch,
          header: "Success!",
          status: "success",
          content: "Your action has been processed successfully!",
        })
        fetchJobApplications(post_id)
      }
      catch(err:any){
        rendermodal({
          dispatch: dispatch,
          header: "Error!",
          status: "error",
          content: "We could not perform this action at the moment please try again later!",
        })
      }
    }
  }

  async function fetchJobApplications(id:any) {
   if(!isLoading){
    try {
      const resp = await getData({ endpoint:`/job-applications-user/?jobpost=${id}` }).unwrap();
      if (resp) setJobApplications(resp.results);
    } catch (error: any) {}
  }
  }

  useEffect(() => {
   post_id &&  fetchJobApplications(post_id);
  }, [post_id]);

  function BottomContent(){
    return (
      <View style={[globalstyles.column,{paddingHorizontal:20}]}>
          <RenderButtonRow 
            Icon={FontAwesome}
            icon_color={theme.text}
            icon_name="user"
            icon_size={24}
            action={()=>{ setOpenBottomSheetDrawer(false);
              router.push({ pathname:'/(app)/(search)/(people)/user-profile', params:
                {user_id:selectedItem.applicant.user_id}
            })}}
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={`Visit ${selectedItem.applicant.full_name}'s Profile`}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>

          {['reviewed','declined'].includes(selectedItem.status) && !selectedItem.jobpost.is_read_only &&
          <RenderButtonRow 
            Icon={FontAwesome}
            icon_color={'green'}
            icon_name="check-circle-o"
            icon_size={24}
            action={()=>{
              performAction({status:'accepted'})
            }}
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={`Accept ${selectedItem.applicant.full_name} Application`}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
            }

          {['reviewed','accepted'].includes(selectedItem.status) && !selectedItem.jobpost.is_read_only 
          &&
          <RenderButtonRow 
            Icon={FontAwesome}
            icon_color="red"
            icon_name="times-circle-o"
            icon_size={24}
            action={()=>{performAction({status:'declined'})}}
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={`Decline ${selectedItem.applicant.full_name} Application`}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
            }
      </View>
    )
  }

  function JobselectedItemCard({ item ,index}: any) {
    const {dat,time} = dateFormater(item.application_date)
    return( 
    <TouchableOpacity
     onPress={()=>openDialogue(item)}
    style={[globalstyles.row,{backgroundColor:theme.card,padding:10,gap:10,marginVertical:5, 
      marginHorizontal:5 }]}
    >
          <View style={[globalstyles.columnCenter,{width:30,height:30,borderRadius:15,
            marginTop:10,
            backgroundColor:'rgba(0,105,0,0.3)'
          }]}>
            <Text style={{color:theme.text,fontWeight:'500'}}>{index+1}</Text>
          </View>

        <View style={{
            height:60,
            width:60,
            backgroundColor:'orange',
            borderRadius:30
          }}>
        
          { item?.applicant?.profile_picture ?
            <Image 
            style={{height:60, width:60,borderRadius:30}} 
            source={{uri:item.applicant.profile_picture}}/>
            :
            <View  style={[globalstyles.columnCenter,{height:60, width:60,borderRadius:30}]} >
              <Text style={{fontFamily:'Poppins-Bold',color:'#fff',fontSize:21}}>{
                item?.applicant?.full_name.slice(0,1)
                }
            </Text>
            </View>
          }
        </View>
          
          <View style={[globalstyles.column,{paddingHorizontal:5,
          width:'50%',
            overflow:'hidden'}]}>
                <Text style={{fontFamily:'Poppins-Bold',color:theme.text}}>
                  {item?.applicant?.full_name}</Text>
                <Text style={{color:'#888',fontSize:10}}>@{item?.applicant?.username}</Text>

                <Text style={[{
                  paddingVertical:10, 
                  fontFamily:'Nunito-Bold',color:'darkslateblue'},
                 item.status == 'accepted' && { color: 'green'},
                 item.status == 'reviewed' && {color:'orange'},
                 item.status == 'declined' && {color:'red'}

                  ]}>
                  {item.status}
                </Text>
          </View>

          <View style={{width:'15%'}}>
            <Text style={{color:theme.text,fontWeight:'700'}}>Score</Text>
            <Text style={{
              color: item.score < 50 ? 'red' :'green',
              fontFamily:'Poppins-Bold'}}>{item.score}</Text>
          </View>
          

          <View style={{position:'absolute',bottom:10,right:10}}>
                <Text style={{color:'#888',fontWeight:'500',
                  fontSize:10,
                  paddingHorizontal:10}}>
                    {dat} {' '} {time}</Text>
          </View>

    </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      {isLoading ?
      <Loading/> :
      
      jobapplications && jobapplications.length > 0 ? (
        <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
         showsVerticalScrollIndicator={false}
          keyExtractor={(item,index) => index.toString()}
          data={jobapplications}
          renderItem={({ item, index }: { item: any; index: number }) => (
            <JobselectedItemCard item={item} index={index} key={index} />
          )}
        />
      ) : 
      <ScrollView 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>{
        isError ?
        <NotFound
         body="Oops! Nothing here"
        /> 
        :
      ( 
        <View style={[globalstyles.columnCenter, { height: "100%",paddingTop:'50%' }]}>
          <Text style={{ color: theme.text, textAlign: "center" }}>
            Found 0 selectedItems
          </Text>
        </View>
        
      )}
      </ScrollView>
      }

{openBottomSheetDrawer &&
      <BottomSheetDrawer
      index={openBottomSheetDrawer?1:-1}
      snapPoints={snapPoints}
      handleClose={()=>setOpenBottomSheetDrawer(false)}
      bottomSheetRef={bottomSheetRef}
      >
       <BottomContent/>
       </BottomSheetDrawer>
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
};

