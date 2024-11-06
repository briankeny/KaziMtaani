import BottomSheetDrawer from "@/kazisrc/components/BottomSheetDrawer";
import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { CustomUserAvatar } from "@/kazisrc/components/Headers";
import { Loading } from "@/kazisrc/components/Loading";
import NotFound from "@/kazisrc/components/NotFound";
import Toast from "@/kazisrc/components/Toast";
import { useDeleteResourceMutation, useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateFormater } from "@/kazisrc/utils/utils";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, View, Text, RefreshControl, TouchableOpacity,Image, Dimensions } from "react-native";
import { useSelector } from "react-redux";

const MyJobReviewsScreen = () => {
  const dispatch = useAppDispatch();
  const { theme } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const [getData, { isLoading, isError, error, isSuccess }] =
    useGetResourceMutation();
  const { userData } = useSelector((state: any) => state.auth);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(false);
  const snapPoints = useMemo(() => [ "10%","25%"], []);
  const [deleteData, { isLoading: delLoading }] = useDeleteResourceMutation()
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [reviews, setReviews] = useState<any>([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchReviews()
    }, 2000);
  }, [router]);



  async function fetchReviews() {
    try {
      const resp = await getData({
        endpoint: `/reviews/?reveiwer=${userData.user_id}`,
      }).unwrap();
      if (resp) {
        const data = resp.results ? resp.results : [];
        setReviews(data);
      }
    } catch (error: any) {}
  }


  async function deleteReview(id:any) {
    if (!delLoading) {
      setOpenBottomSheetDrawer(false)
      try {
        await deleteData({
          endpoint: `/review/${id}/`,
        })
          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "Review has been deleted!",
          });
        fetchReviews()
      } catch (error: any) {
        rendermodal({
          dispatch: dispatch,
          header: "Error!",
          status: "error",
          content: "Could not perform action please try again later",
        });
      }
    }
  }

  
  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  function openDialogue(item:any){
    setSelectedItem(item)
    setOpenBottomSheetDrawer(true)
  }


  function BottomContent(){
    return(
         <View style={[globalstyles.column,{paddingHorizontal:20}]}>
         
            <RenderButtonRow 
              Icon={MaterialIcons}
              icon_color="red"
              icon_name="delete"
              icon_size={24}
              action={()=>deleteReview(selectedItem.review_id)}
              buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
              button_text={"Delete Review :- This action cannot be undone " }
              buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
        </View>
    )
   }
  

  function ReviewCard({ item , dat, time}: any) {
    return (
      <TouchableOpacity 
      onPress={()=>openDialogue(item)}
      style={[ globalstyles.card,
      { backgroundColor: theme.card,marginVertical:10,width:'96%'}]}>
           <View style={[globalstyles.row,{gap:10}]}>
                
                   <View   
                   style={{
                      
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                        }}>
                    { userData.profile_picture ?
                        <Image
                        style={{
                          resizeMode: "center",
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                        }}
                        source={{ uri: userData.profile_picture }}
                      />
                   :
                      <CustomUserAvatar name={userData.full_name} />
                    }
                    </View>
                    <View style={{width:'85%', overflow:'hidden'}}>
                      <Text 
                      numberOfLines={1}
                      ellipsizeMode='tail'
                      style={{color:theme.text,fontFamily:'Poppins-Bold'}}>
                              {userData.full_name}
                      </Text>
                      <Text style={{ color: theme.text }}>{item.review_text}</Text>
                  </View>
              </View>

              <View style={[globalstyles.row,{gap:20,width:'75%',alignSelf:'center', marginVertical:13}]}>
                  { [20,40,60,80,100].map((i:any,index:number)=>
                   
                          <AntDesign 
                           key={index}
                              name={ item.rating >= i ? "star" : "staro"} 
                              size={24} 
                              color={  item.rating >= i ? "orange": theme.text}
                              />
                  )
                  }
              </View>
          
          <JobCardReview
          item={item.jobpost}
          theme={theme}
          dat={dat}
          time={time}
          />
       
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      {isLoading ? (
        <Loading />
      ) : reviews && reviews.length > 0 ? (
        <FlatList
        refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          keyExtractor={(item, index) => index.toString()}
          data={reviews}
          renderItem={({ item, index }: { item: any; index: number }) => {
            const {dat,time} = dateFormater(item.jobpost.date_posted)
            return(
            <ReviewCard item={item} dat={dat} time={time} key={index} />
          )}}
        />
      ) : (
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
        >
          {isError ? (
            <NotFound
              body={
                "Ooop! Nothing here..."
              }
            />
          ) : (
            <View
              style={[
                globalstyles.columnCenter,
                { width: "100%", paddingTop: "50%" },
              ]}
            >
              <Text style={{ color: theme.text }}>
                You have not reviewed any job yet
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      
      
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
};

export default MyJobReviewsScreen;



export function JobCardReview({item, theme, dat ,time}:any){

  return(
    <TouchableOpacity
    onPress={()=>router.push(
     {pathname: '/(app)/(search)/(jobs)/job-profile',
       params:{post_id:item.post_id}
     })}

   style={[
     {
       backgroundColor: theme.card,
       elevation: 3,
       borderColor :theme.text,
       borderWidth:1,
       alignSelf:'flex-end',
       marginHorizontal: 20,
       marginBottom: 10,
       borderRadius: 10,
       padding: 10,
       width: '80%',
     },
   ]}
 >
   <View style={[globalstyles.row, { gap: 10, width: "100%" }]}>
     <View
       style={{
         width: 60,
         height: 60,
         borderRadius: 30,
         overflow: "hidden",
         backgroundColor: "orange",
       }}
     >
       { item?.job_picture ? (
         <Image
           style={{
             width: 60,
             height: 60,
             borderRadius: 30,
             objectFit: "cover",
           }}
           source={{ uri: item.job_picture}}
         />
       ) : (
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
             {item?.title.slice(0, 1)}
           </Text>
         </View>
       )}
     </View>

     <View style={{ overflow: "hidden", width: "50%" }}>
       
   <Text
     numberOfLines={1}
     ellipsizeMode="tail"
     style={{
       color: theme.text,
       paddingHorizontal: 2,
       paddingTop:14,
       fontSize: 12,
       fontFamily: "Poppins-Bold",
     }}
   >
     {item?.title}
   </Text>
      
       <Text
         numberOfLines={1}
         ellipsizeMode="tail"
         style={{
           fontWeight: "500",
           color:'#888',
           fontSize:10
         }}
       >
         {item?.location}
      
       </Text>
     </View>

     <Text
       style={{
         color: theme.text,
         fontSize: 10,
         top: 0,
         right: 0,
         position: "absolute",
       }}
     >
       {dat} {' '} {time}
     </Text>
   </View>

   <Text
     style={{
       color: "green",
       paddingBottom: 8,
       paddingHorizontal: 20,
       fontFamily: "Poppins-Bold",
       fontSize: 16,
     }}
   >
     {item?.salary_range}
   </Text>

   <View style={[globalstyles.rowWide, { paddingLeft: 20 }]}>
     <Text style={{ color: "#888", fontSize: 12 }}>
       {item?.experience_level}
     </Text>

     <Text style={{ color: "#888", fontSize: 12 }}>
       {item?.employment_type}
     </Text>

     <View style={[globalstyles.row, { gap: 1}]}>
 <MaterialIcons name="bar-chart" size={18} color={"#666"} />
 <Text
   numberOfLines={1}
   ellipsizeMode="tail"
   style={{
     color: "orange",
     fontSize: 11,
     fontWeight: "500",
     paddingTop: 2,
   }}
 >
   {item.impressions}
 </Text>
</View>
     

   </View>
 </TouchableOpacity>
  )
}