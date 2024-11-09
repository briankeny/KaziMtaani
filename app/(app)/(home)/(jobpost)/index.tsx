import { useDeleteResourceMutation, useGetResourceMutation, usePatchResourceMutation } from "@/kazisrc/store/services/authApi";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { setJobPosts } from "@/kazisrc/store/slices/jobsSlice";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Loading } from "@/kazisrc/components/Loading";
import NotFound from "@/kazisrc/components/NotFound";
import { router } from "expo-router";
import { dateFormater, formatDateToString } from "@/kazisrc/utils/utils";
import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetDrawer from "@/kazisrc/components/BottomSheetDrawer";
import Toast from "@/kazisrc/components/Toast";

export default function JobPostsAdminScreen() {
  const dispatch = useAppDispatch();
  const { theme } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const { userData } = useSelector((state: any) => state.auth);
  const { jobposts } = useSelector((state: any) => state.jobs);
  const [getData, { isLoading, isError}] =
    useGetResourceMutation({ fixedCacheKey: "jobs_search" });
  const [patchData,{isLoading:patchLoading}] = usePatchResourceMutation()
  const [deleteData, { isLoading: delLoading }] = useDeleteResourceMutation();
  const [post,setPost] = useState<any>({})
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(false);
  const snapPoints = useMemo(() => [ "10%", "25%", "50%"], []);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchJobPosts()
    }, 2000);
  }, []);


  async function performAction(data:any){
    if(!patchLoading){
      setOpenBottomSheetDrawer(false);
      try{
        const resp = await patchData({data:data , endpoint:`/job-post/${post.post_id}/`}).unwrap()
        if(resp)
        rendermodal({
          dispatch: dispatch,
          header: "Success!",
          status: "success",
          content: "Your job has been sealed and concluded. Applicants have been notified!",
        })
        fetchJobPosts()
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

  async function fetchJobPosts() {
    try {
      const resp = await getData({
        endpoint: `/job-posts/?recruiter=${userData.user_id}`,
      }).unwrap();
      if (resp) {
        const data = resp.results ? resp.results : [];
        dispatch(setJobPosts(data));
      }
    } catch (error: any) {}
  }

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  useEffect(() => {
    fetchJobPosts();
  }, []);

  async function  deletePost(){
   if(!delLoading){
    try{
      await deleteData({
        endpoint: `/job-post/${post.post_id}/`,
      })

      rendermodal({
        dispatch: dispatch,
        header: "Success!",
        status: "success",
        content: "Job post has been removed!",
      });

      fetchJobPosts()

    }
    catch(error:any){
      rendermodal({
        dispatch: dispatch,
        header: "Error!",
        status: "error",
        content: 'Job post could not be removed. Please try again later',
      });
    }
  }
  }
  
  function opendialogue(item:any) {
    setPost(item)
    setOpenBottomSheetDrawer(true)
  }

  function BottomContent(){
    return (
      <View style={[globalstyles.column,{paddingHorizontal:20}]}>
          <RenderButtonRow 
            Icon={FontAwesome5}
            icon_color={theme.text}
            icon_name="users"
            icon_size={24}
            action={()=>{
              setOpenBottomSheetDrawer(false);
              router.push(
              {pathname:'/(app)/(home)/(jobpost)/applicants',
               params:{post_id:post.post_id}
              })
            }
            }
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={"View Applicants :- Approve , Decline Applications"}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
          
          { ! post.is_read_only &&
          <RenderButtonRow 
            Icon={AntDesign}
            icon_color={theme.text}
            icon_name="checkcircle"
            icon_size={24}
            action={()=> performAction({status:'closed'}) }
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={"Close Job Post :- Conclude all applications"}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
            }

          { ! post.is_read_only &&
          <RenderButtonRow 
            Icon={MaterialIcons}
            icon_color="red"
            icon_name="delete"
            icon_size={24}
            action={()=>{
              setOpenBottomSheetDrawer(false);
              deletePost()}}
            buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
            button_text={"Delete Job Post :- This action cannot be undone. Remove Post id:- " + post.post_id + " "}
            buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
          }
      </View>
    )
  }

  function JobPostCard({ item, dat, time, date_posted }: any) {
    return (
      <TouchableOpacity
        onPress={()=>opendialogue(item)}
        style={[
          globalstyles.column,
          {
            backgroundColor: theme.card,
            alignSelf: "center",
            marginVertical: 5,
            borderRadius: 4,
            paddingVertical: 5,
            width: "90%",
            elevation: 1,
          },
        ]}
      >
        <View
          style={[
            globalstyles.row,
            {
              paddingHorizontal: 10,
              gap: 5,
              paddingVertical: 10,
              overflow: "hidden",
            },
          ]}
        >
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: "orange",
            }}
          >
            {item?.job_picture ? (
              <Image
                style={{ height: 60, width: 60, borderRadius: 30 }}
                source={{ uri: item.job_picture }}
              />
            ) : userData.profile_picture ? (
              <Image
                style={{ height: 60, width: 60, borderRadius: 30 }}
                source={{ uri: userData.profile_picture }}
              />
            ) : (
              <View
                style={[globalstyles.columnCenter,{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  backgroundColor: "orange",
                }]}
              >
                <Text style={{ fontFamily: "Poppins-Bold", fontSize: 15,color:'#fff' }}>
                  {userData?.full_name?.slice(0, 1)}
                </Text>
              </View>
            )}
          </View>

          <View
            style={[
              globalstyles.column,
              { overflow: "hidden", width: "65%", paddingHorizontal: 5 },
            ]}
          >
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ fontFamily: "Poppins-Bold",color:theme.text }}
            >
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "#888" }}
            >
              {item.description}
            </Text>
          </View>

          <View style={[globalstyles.column]}>
            <View
              style={[
                {
                  backgroundColor:
                    item.status == "closed"
                      ? "rgba(255, 0, 0,0.2)"
                      : "rgba(0,105,0,0.2)",
                  paddingVertical: 1,
                  paddingHorizontal:4,
                  minWidth: 18,
                  height: 20,
                  borderRadius: 25,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight:'500',
                  color: item.status == "closed" ? "red" : "green",
                }}
              >
                {item.status}
              </Text>
            </View>

            <View style={[globalstyles.row, { gap: 1, paddingTop: 10 }]}>
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
        </View>

        <View
          style={{
            width: "100%",
            height: StyleSheet.hairlineWidth,
            backgroundColor: "#888",
          }}
        ></View>

        <View
          style={[
            globalstyles.rowWide,
            { paddingHorizontal: 10, paddingVertical: 5 },
          ]}
        >
          <View style={{}}>
            <Text style={{ color: "#999", fontFamily: "Nunito-Bold" }}>
              Date Posted
            </Text>
            <Text style={{ color: theme.text, fontWeight: "500" }}>
              {date_posted}
            </Text>
          </View>

          <View style={{}}>
            <Text style={{ color: "#999", fontFamily: "Nunito-Bold" }}>
              Deadline Date
            </Text>
            <Text style={{ color: theme.text, fontWeight: "500" }}>
              {dat} {time}
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
      {isLoading ? (
        <Loading />
      ) : jobposts && jobposts.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          data={jobposts}
          renderItem={({ item, index }: { item: any; index: number }) => {
            const { dat, time } = dateFormater(item.deadline_date);
            const dateposted = formatDateToString(item.date_posted);
            return (
              <JobPostCard
                item={item}
                dat={dat}
                date_posted={dateposted}
                time={time}
                index={index}
                key={index}
              />
            );
          }}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isError ? (
            <NotFound body="Oops! Nothing here" />
          ) : (
            <View
              style={[
                globalstyles.columnCenter,
                { height: "100%", paddingTop: "50%" },
              ]}
            >
              <Text style={{ color: theme.text, textAlign: "center" }}>
                Found 0 job posts
              </Text>
            </View>
          )}
        </ScrollView>
      )}
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
}
