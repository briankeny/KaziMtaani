import BottomSheetDrawer from "@/kazisrc/components/BottomSheetDrawer";
import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { Loading } from "@/kazisrc/components/Loading";
import Toast from "@/kazisrc/components/Toast";
import { useDeleteResourceMutation, useGetResourceMutation} from "@/kazisrc/store/services/authApi";
import { setJobApplication, setJobApplications } from "@/kazisrc/store/slices/jobsSlice";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateFormater, formatDateToString } from "@/kazisrc/utils/utils";
import { FontAwesome5,MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { useSelector } from "react-redux";

export default function JobApplicationsScreen() {
  const dispatch = useAppDispatch();
  const { theme,isNightMode  } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const {userData} = useSelector((state:any)=> state.auth)
  const {jobapplications} = useSelector((state:any)=>state.jobs)
  const [deleteData, { isLoading: delLoading }] = useDeleteResourceMutation()
  const [getData, { isLoading, isError, error, isSuccess }] =
    useGetResourceMutation();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(false);
    const snapPoints = useMemo(() => ["25%", "50%", "75%", "100%"], []);
  const [selectedItem, setSelectedItem] = useState<any>({})
  
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
       fetchJobAps()
    }, 2000);
  }, []);
  
  async function fetchJobAps() {
    try {
      const resp = await getData({ endpoint:`/job-applications-user/?applicant=${userData.user_id}` }).unwrap();
      if (resp) 
        dispatch(setJobApplications(resp.results));
    } catch (error: any) {}
  
   }


  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  async function cancelApplication(id:any) {
    if (!delLoading) {
       setOpenBottomSheetDrawer(false)
      try {
        await deleteData({
          endpoint: `/job-application/${id}/`,
        })
          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "Application has been cancelled!",
          });
        fetchJobAps()

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

  function openDialogue(item:any){
    setSelectedItem(item)
    setOpenBottomSheetDrawer(true)
  }

  function goToTracker(){
    setOpenBottomSheetDrawer(false)  
    dispatch(setJobApplication(selectedItem))
    router.push('/(app)/(home)/(jobapplications)/tracker')
  }

  useEffect(() => {
    fetchJobAps();
  }, []);

  useEffect(()=>{
    if(isError)   
     rendermodal({
     dispatch: dispatch,
     header: "Error!",
     status: "error",
     content: "Oops! An Error Occurred while trying to fetch job applications!",
   })
 },[isError])

 function BottomContent(){
  return(
       <View style={[globalstyles.column,{paddingHorizontal:20}]}>
          <RenderButtonRow 
            Icon={FontAwesome5}
            icon_color={theme.text}
            icon_name="users"
            icon_size={24}
            action={()=>goToTracker()}
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={"Track Application :- View Progress"}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
          
          <RenderButtonRow 
            Icon={MaterialIcons}
            icon_color='orange'
            icon_name="reviews"
            icon_size={24}
            action={()=>{setOpenBottomSheetDrawer(false);
              router.push({pathname:'/(app)/(home)/(jobapplications)/create-review'

                ,params:{post_id:selectedItem.jobpost.post_id}
              })
            }}
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={"Submit a review :- Give us your feedback"}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
          { !(selectedItem.jobpost.is_read_only)  &&
          <RenderButtonRow 
            Icon={MaterialIcons}
            icon_color="red"
            icon_name="delete"
            icon_size={24}
            action={()=>cancelApplication(selectedItem.id)}
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={"Cancel Application :- This action cannot be undone " }
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
            }
      </View>
  )
 }

 function JobApplicationCard({ item}: any) {
  const {dat,time} = dateFormater(item.application_date);
  const approvaldate = formatDateToString(item.approval_date)
  return (
    <TouchableOpacity
     onPress={()=>openDialogue(item)}
      style={[
        globalstyles.card,
        {
          backgroundColor: theme.card,
          marginVertical:4    
        },
      ]}
    >
  
      <View style={[globalstyles.column,{position:'absolute',right:10,top:5}]}>
          <Text style={[{ color: theme.text, fontSize: 11 }]}> {dat} {time}</Text>
      </View>

      <View style={[globalstyles.row,{gap:10}]}>
        <View style={{
            height:60,
            width:60,
            backgroundColor:'orange',
            borderRadius:30
          }}>
          
          { item?.jobpost?.job_picture ?
            <Image style={{height:60, width:60,borderRadius:30}}
             source={{uri:item.jobpost.job_picture}}/>
            :
            <View style={[globalstyles.columnCenter,{
              height:60,
              width:60,
              backgroundColor:'rgba(0,105,0,0.5)',
              borderRadius:30
            }]}>
              <Text
              style={{color:'#fff',fontFamily:'Poppins-Bold',fontSize:19}}
              >{item?.jobpost?.recruiter?.full_name?.slice(0,1)}</Text>
            </View>
           
          }
         
        </View>
        
        <View style={[globalstyles.column,{paddingHorizontal:5,overflow:'hidden',width:'80%'
        }]}>
        <Text numberOfLines={1}
        ellipsizeMode="tail"
        style={[{ color: theme.text, fontFamily:'Poppins-Bold' }]}>
          {item?.jobpost?.title}
        </Text> 
            <Text 
            numberOfLines={2}
            ellipsizeMode='tail'
            style={{color:theme.text, 
              fontFamily:'Poppins-Regular'
            }}>
              {item?.jobpost?.description}
            </Text>
        </View>       
      </View>

      <View
          style={{
            width: "100%",
            height: StyleSheet.hairlineWidth,marginVertical:20,
            backgroundColor: "#888",
          }}
        ></View>

      <View style={[globalstyles.rowEven,{overflow:'hidden'}]}>
          
          <View style={[globalstyles.column]}>
              <Text style={{color:theme.text,fontFamily:'Nunito-Bold'}}>
                Your Score
              </Text>
              <Text style={{fontFamily:'Poppins-Bold',color:'green',paddingTop:5}}>
                  {item.score}
              </Text>
          </View>

          <View style={[globalstyles.column]}>
              <Text style={{color:theme.text,fontFamily:'Nunito-Bold'}}>
                Status
              </Text>
              <Text style={[{fontFamily:'Poppins-Bold',color:'orange',fontSize:12,paddingTop:5},
                item.status == 'declined' &&{color:'red'}, item.status =='accepted'&&{color:'green'}]}>
                  {item.status}
              </Text>
          </View>

          <View style={[globalstyles.column]}>
              <Text style={{color:'#888',fontFamily:'Nunito-Bold'}}>
                Review Date
              </Text>
              <Text style={{fontFamily:'Poppins-Bold',color:theme.text,fontSize:12,paddingTop:5}}>
                  {approvaldate}
              </Text>
          </View>
      </View>
    </TouchableOpacity>
  );
}


  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      { 
      isLoading ?
      <Loading/>:
      jobapplications && jobapplications.length > 0 ?
      <FlatList
         
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
        keyExtractor={(item,index) => index.toString()}
        data={jobapplications}
        renderItem={({ item, index }: { item: any; index: number }) => (
          <JobApplicationCard item={item} theme={theme} key={index} />
        )}
      />
    : 
     <View style={[globalstyles.columnCenter,{height:'100%'}]}>
        <Text style={{color:theme.text,textAlign:'center'}}>Found 0 job applications</Text>
     </View>
    }

      {openBottomSheetDrawer && (
          <BottomSheetDrawer
            index={openBottomSheetDrawer ? 1 : -1}
            snapPoints={snapPoints}
            handleClose={() => setOpenBottomSheetDrawer(false)}
            bottomSheetRef={bottomSheetRef}
          >
            <BottomContent/>
          </BottomSheetDrawer>

      )}


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