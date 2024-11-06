import React, { useEffect, useState } from "react";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import {
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Swipper from "@/kazisrc/components/Swipper";
import { dateFormater, formatDateToString } from "@/kazisrc/utils/utils";
import Toast from "@/kazisrc/components/Toast";
import { clearModal } from "@/kazisrc/store/slices/modalSlice";
import { CustomUserAvatar } from "@/kazisrc/components/Headers";
import { JobCardReview } from "../../(home)/(jobapplications)/my-reviews";
import { Checkmark } from "@/kazisrc/components/Checkmark";
import { setConvo, setCurrentReceiver } from "@/kazisrc/store/slices/messageSlice";

const UserScreen = () => {
  const { user_id } = useGlobalSearchParams();
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const {userData} = useSelector((state:any)=>state.auth)

  const [getData, { isLoading, isError, error, isSuccess }] =
    useGetResourceMutation();
  const [person, setPerson] = useState<any>({});
  const [skills, setSkills] = useState<any>([]);
  const [userSections, setUserSections] = useState<any>([]);
  const [reviews, setReviews] = useState<any>([]);
  const [posts, setPosts] = useState<any>([]);

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  function goToMessages(item:any){
    const convo = {
      chat_id : 0,
      participants:[userData,item],
      latest_message:''
    }
    dispatch(setConvo(convo))
    dispatch(setCurrentReceiver(person))
    router.push({pathname:'/(messages)/conversation'})
  }

  async function fetchUser() {
    if (!isLoading) {
      try {
        const resp = await getData({ endpoint: `/user/${user_id}/` }).unwrap();
        if (resp) setPerson(resp);
      } catch (error: any) {}
    }
  }
  async function fetchUserSkills() {
    try {
      const resp = await getData({
        endpoint: `/user-skills/?search=${user_id}`,
      }).unwrap();
      if (resp) {
        const data = resp?.results ? resp.results : [];
        setSkills(data);
      }
    } catch (error) {}
  }

  async function fetchUserSections() {
    try {
      const resp = await getData({
        endpoint: `/user-info/?search=${user_id}`,
      }).unwrap();
      if (resp) {
        const data = resp?.results ? resp.results : [];
        setUserSections(data);
      }
    } catch (error) {}
  }

  async function fetchReviews() {
    try {
      const resp = await getData({
        endpoint: `/reviews/?reveiwer=${user_id}`,
      }).unwrap();
      if (resp) setReviews(resp.results);
    } catch (error: any) {}
  }

  async function fetchUserPosts() {
    try {
      const resp = await getData({
        endpoint: `/job-posts/?recruiter=${user_id}`,
      }).unwrap();
      if (resp) setPosts(resp.results);
    } catch (error: any) {}
  }

  useEffect(() => {
    fetchUserSkills();
  }, []);

  useEffect(() => {
    fetchUserSections();
  }, []);

  useEffect(() => {
    user_id && fetchUser();
  }, [user_id]);

  useEffect(() => {
    person && person.account_type == "jobseeker" && fetchReviews();
  }, [person]);

  useEffect(() => {
    person && person.account_type == "recruiter" && fetchUserPosts();
  }, [person]);

  function JobPostCard({ item }: any) {
    const { dat, time } = dateFormater(item.deadline_date);
    const date_posted = formatDateToString(item.date_posted);
    return (
      <TouchableOpacity
        onPress={() => router.push({
         pathname: "/(app)/(search)/(jobs)/job-profile",
         params:{post_id:item.post_id}
        })}
        style={[
          globalstyles.card,
          {
            backgroundColor: theme.card,
            alignSelf: "center",
            marginVertical: 5,
            width: "99%",
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
              backgroundColor: "gray",
            }}
          >
            {item?.job_picture ? (
              <Image
                style={{ height: 60, width: 60, borderRadius: 30 }}
                source={{ uri: item.job_picture }}
              />
            ) : person.profile_picture ? (
              <Image
                style={{ height: 60, width: 60, borderRadius: 30 }}
                source={{ uri: person.profile_picture }}
              />
            ) : (
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  backgroundColor: "gray",
                }}
              >
                <Text style={{ fontFamily: "Poppins-bold", fontSize: 15 }}>
                  {person?.full_name?.slice(0, 1)}
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
              style={{ fontFamily: "Poppins-Bold", color: theme.text }}
            >
              {item.recruiter.full_name}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "#888" }}
            >
              @{item.recruiter.username}
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
                  paddingHorizontal: 4,
                  minWidth: 18,
                  height: 20,
                  borderRadius: 25,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "500",
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

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: theme.text,
            paddingHorizontal: 20,
            paddingBottom: 5,
            fontSize: 18,
            fontFamily: "Poppins-Bold",
          }}
        >
          {item?.title}
        </Text>

        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={{
            color: theme.text,
            paddingBottom: 8,
            paddingHorizontal: 20,
          }}
        >
          {item?.description}
        </Text>

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

        <View style={[globalstyles.rowEven]}>
          <Text style={{ color: "#999", fontSize: 12 }}>
            {item?.experience_level}
          </Text>

          <Text style={{ color: "#999", fontSize: 12 }}>
            {item?.employment_type}
          </Text>

          <Text
            style={{ color: theme.text, fontFamily: "Poppins-Bold", fontSize: 12 }}
          >
            {date_posted}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function ReviewCard({ item }: any) {
    const { dat, time } = dateFormater(item.date_posted);
    return (
      <View
        style={[
          globalstyles.card,
          { backgroundColor: theme.card, marginVertical: 10, width: "96%" },
        ]}
      >
        <View style={[globalstyles.row, { gap: 10 }]}>
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
            }}
          >
            {person.profile_picture ? (
              <Image
                style={{
                  resizeMode: "center",
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                }}
                source={{ uri: person.profile_picture }}
              />
            ) : (
              <CustomUserAvatar name={person.full_name} />
            )}
          </View>
          <View style={{ width: "85%", overflow: "hidden" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: theme.text, fontFamily: "Poppins-Bold" }}
            >
              {person.full_name}
            </Text>
            <Text style={{ color: theme.text }}>{item.review_text}</Text>
          </View>
        </View>

        <View
          style={[
            globalstyles.row,
            { gap: 20, width: "75%", alignSelf: "center", marginVertical: 13 },
          ]}
        >
          {[20, 40, 60, 80, 100].map((i: any, index: number) => (
            <AntDesign
              key={index}
              name={item.rating >= i ? "star" : "staro"}
              size={24}
              color={item.rating >= i ? "orange" : theme.text}
            />
          ))}
        </View>

        <JobCardReview
          item={item.jobpost}
          theme={theme}
          dat={dat}
          time={time}
        />
      </View>
    );
  }

  function UserHeaderComponent({ children }: any) {
    return (
      <View style={[globalstyles.column, { padding: 2 }]}>

      <View style={[globalstyles.rowWide,{padding:20}]}>
          <Pressable 
          onPress={()=>router.back()}>
            <AntDesign name="back" size={30} color={'gray'} />
          </Pressable>


        {userData.user_id != person.user_id &&
            <TouchableOpacity onPress={()=>goToMessages(person)} >   
                <Ionicons name="mail" size={24} color={theme.text} />
            </TouchableOpacity>   
        }
   
      </View>

     <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            marginVertical: 10,
            overflow: "hidden",
            backgroundColor: "orange",
            alignSelf: "center",
          }}
        >
          {person?.profile_picture ? (
            <Image
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                objectFit: "cover",
              }}
              source={{ uri: person.profile_picture }}
            />
          ) : (
            <View
              style={[
                globalstyles.columnCenter,
                {
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  overflow: "hidden",
                  backgroundColor: "rgb(255,123,23)",
                },
              ]}
            >
              <Text
                style={[
                  {
                    fontFamily: "Poppins-ExtraBold",
                    fontSize: 100,
                    color: "#fff",
                    textAlign: "center",
                  },
                ]}
              >
                {person?.full_name?.slice(0, 1)}
              </Text>
            </View>
          )}
        </View>

        <View>
          <View
            style={[
              globalstyles.row,
              { gap: 10, alignSelf: "center", paddingLeft: 20 },
            ]}
          >
            <Text
              style={{
                color: theme.text,
                fontFamily: "Poppins-Bold",
                fontSize: 23,
                textAlign: "center",
              }}
            >
              {person.full_name}
            </Text>
            <Checkmark
              tier={person.tier}
              size={26}
              issuperuser={person.is_superuser}
            />
          </View>
          <Text
            style={{
              color: "#999",
              fontFamily: "Poppins-Regular",
              fontSize:13,
              textAlign: "center",
            }}
          >
            @{person.username}
          </Text>
        </View>


{userData.user_id == person.user_id &&
    <View style={[globalstyles.columnCenter,{ 
      borderRadius:20, width:40 ,height:22,alignSelf:'center',
    backgroundColor:'rgba(31, 61, 122,0.7)'}]}>
        <Text style={{color:'#fff',fontWeight:'600'}}>You</Text>
    </View> 
    }
   

       
        {person.industry&&
        <Text style={{ color: theme.text, textAlign: "center", padding: 10, fontWeight:'500' }}>
          {person?.industry}
        </Text>
        }

        {person.bio && (
          <View
            style={[
              globalstyles.card,
              { backgroundColor: theme.card, elevation: 2, marginVertical: 2 },
            ]}
          >
            <Text
              style={{
                color: theme.text,
                fontFamily: "Poppins-Bold",
                fontSize: 17,
              }}
            >
              Bio
            </Text>
            <Text style={{ color: theme.text }}>{person.bio}</Text>
          </View>
        )}

        {children}
      </View>
    );
  }

  function CustomSectionComponent({ item }: any) {
    const start_date = item.start_date
      ? formatDateToString(item.start_date)
      : "";
    const end_date = item.end_date ? formatDateToString(item.end_date) : "";
    return (
      <View
        style={[
          globalstyles.card,
          { backgroundColor: theme.card, elevation: 2, marginVertical: 2 },
        ]}
      >
        {item.subject && (
          <Text
            style={{
              color: theme.text,
              fontFamily: "Poppins-Bold",
              fontSize: 17,
            }}
          >
            {item?.subject}
          </Text>
        )}
        <Text
          style={{
            color: "rgba(0,105,0,0.9)",
            fontFamily: "Nunito-Bold",
            fontSize: 16,
            paddingVertical: 3,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ color: theme.text }}>{item.description}</Text>

        <View
          style={[
            globalstyles.row,
            { alignSelf: "center", width: "100%", paddingTop: 5 },
          ]}
        >
          {item.start_date && (
            <Text style={{ color: "#999", fontFamily: "SpaceMono-Regular" }}>
              {start_date} -{" "}
            </Text>
          )}
          {item.end_date && (
            <Text style={{ color: "#999", fontFamily: "SpaceMono-Regular" }}>
              {end_date}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        globalstyles.safeArea,
        {
          backgroundColor: theme.background,
          paddingTop: StatusBar.currentHeight,
        },
      ]}
    >
      <Swipper
        viewPagerStyle={{ flex: 1, height: "100%", width: "100%" }}
        swipperStyles={{ flex: 1, height: "100%", width: "100%" }}
        setPage={() => console.log("test")}
      >
        <FlatList
          key="1"
          ListHeaderComponent={() => (
            <UserHeaderComponent>
              {skills && skills.length > 0 && (
                <View
                  style={[
                    globalstyles.card,
                    {
                      backgroundColor: theme.card,
                      elevation: 2,
                      marginVertical: 2,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: theme.text,
                      fontFamily: "Poppins-Bold",
                      fontSize: 17,
                    }}
                  >
                    {person.full_name} Skills
                  </Text>
                  <View
                    style={[globalstyles.row, { gap: 5, flexWrap: "wrap" }]}
                  >
                    {skills.map((item: any, index: number) => (
                      <View key={index} style={[globalstyles.rowEven]}>
                        <Entypo
                          name="dot-single"
                          size={24}
                          color={theme.text}
                        />
                        <Text style={{ color: theme.text, paddingRight: 10 }}>
                          {item.skill_name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </UserHeaderComponent>
          )}
          data={userSections}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item, index }) => (
            <CustomSectionComponent key={index} item={item} />
          )}
        />

        <FlatList
          key="2"
          ListHeaderComponent={() => (
            <View style={[globalstyles.column, { marginBottom: 10 }]}>
              <Text
                style={{
                  color: "#448EE4",
                  textAlign: "center",
                  fontSize: 20,
                  textTransform: "capitalize",
                  fontFamily: "Poppins-Bold",
                  fontWeight: "600",
                }}
              >
                {person.account_type == "recruiter"
                  ? person.full_name + " " + "posts"
                  : person.full_name + " " + "reviews"}
              </Text>

              <View
                style={{
                  backgroundColor: "#448EE4",
                  height: 1,
                  width: "30%",
                  alignSelf: "center",
                }}
              ></View>
            </View>
          )}
          data={person.account_type == "recruiter" ? posts : reviews}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item, index }) =>
            person.account_type == "recruiter" ? (
              <JobPostCard key={index} item={item} />
            ) : (
              <ReviewCard key={index} item={item} />
            )
          }
        />
      </Swipper>

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

export default UserScreen;
