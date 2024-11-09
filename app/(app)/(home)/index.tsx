import BottomSheetDrawer from "@/kazisrc/components/BottomSheetDrawer";
import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { HelloWave } from "@/kazisrc/components/HelloWave";
import MapMarker from "@/kazisrc/components/MapMarker";
import MapViewer from "@/kazisrc/components/MapViewer";
import Toast from "@/kazisrc/components/Toast";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { setJobPosts } from "@/kazisrc/store/slices/jobsSlice";
import { clearModal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateFormater } from "@/kazisrc/utils/utils";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Redirect, router } from "expo-router";
import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";


export default function HomeScreen() {
  const dispatch = useAppDispatch()
  const { theme} = useSelector((state: any) => state.theme);

  const {authentication} = useSelector((state:any)=>state.auth)
  const {jobposts} = useSelector((state:any)=>state.jobs);
  const { userData,myLocation} = useSelector((state: any) => state.auth);
  const [analytics, setAnalytics] = useState<any | null>(null);

  const [getUserData, { isLoading: userLoading, data: usersData }] = useGetResourceMutation({ fixedCacheKey: "people_search" });
  const [getData, { isLoading:getLoading, isError:existsGetError, error:getError, isSuccess:getSuccess }] = useGetResourceMutation({fixedCacheKey:'my_jobs'});
  
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
         fetchJobs()
         fetchPeople()
         fetchDataAnalytics()
      }, 2000);
    }, [router]);

    function closeModal() {
      dispatch(clearModal());
      return true;
    }

  const [getJobsData, {isLoading, isError, error, isSuccess }] = useGetResourceMutation({fixedCacheKey:'my_analytics'});

  const [people,setPeople] = useState<any>([])
  const [mapsData,setMapsData] = useState<any>([])

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.8; 
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  
  const [userLocation,setUserLocation] = useState<any>({
    latitude: -1.5256749,
    longitude: 36.9396504,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  })

  useEffect(() => {
    if (myLocation && myLocation.latitude) {
      const latitude = myLocation.latitude
        ? parseFloat(myLocation.latitude)
        : -1.5256749;
      const longitude = myLocation.longitude
        ? parseFloat(myLocation.longitude)
        : 36.9396504;

      setUserLocation({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [myLocation]);


  async function fetchJobs() {
      try {
        const resp = await getData({ endpoint: `/job-posts/?reccommended=True&recruiter=${userData.user_id}` }).unwrap();
        if (resp) {
          const data = resp.results ? resp.results : [];
          dispatch(setJobPosts(data));
        }
      } catch (error: any) {}
  }

  async function fetchPeople() {
    try {
      const resp = await getUserData({ endpoint: "/users/" }).unwrap();
      if (resp) {
        const data = resp.results ? resp.results : [];
         setPeople(data)
      }
    } catch (error: any) {}
  }

  
  async function fetchDataAnalytics() {
    try {
      const resp = await getJobsData({ endpoint: "/analytics/" }).unwrap();
      if (resp) 
        resp&& setAnalytics(resp);
      
    } catch (error) {}
  }


  function goToJobs(){
    if(userData.account_type == 'jobseeker') {
      router.push('/(app)/(home)/(jobapplications)')
    }
    else{
      router.push('/(app)/(home)/(jobpost)')
    }
  }

  function goToReviews(){
    if(userData.account_type == 'jobseeker') 
    router.push('/(app)/(home)/(jobapplications)/my-reviews')
  }

  useEffect(()=>{
    !authentication && <Redirect href ='/' />
 },[authentication])


 useEffect(()=>{
   people &&  userData.account_type == 'recruiter' && setMapsData(people)
  jobposts &&   userData.account_type != 'recruiter' &&  setMapsData(jobposts)
 },[people,jobposts])


 function goToScreen(item:any){
   if(userData.account_type == 'recruiter'){
   router.push({pathname: '/(app)/(search)/(people)/user-profile',
    params:item.user_id
   }) 
   }
   else{
   router.push({
    pathname: '/(app)/(search)/(jobs)/job-profile',
    params: item.post_id
   })
  }
 }


  useEffect(()=>{
    fetchJobs()
    fetchDataAnalytics()
    fetchPeople()
  },[])

  const Menu = ({
    Icon,
    iconSize = 24,
    iconColor = "#888",
    header = "",
    content = "",
    onPress=undefined,
    iconName = "",
  }: any) => {
    return (
      <Pressable
        onPress={onPress}
        style={[
          globalstyles.column,
          {
            width: "30%",
            marginHorizontal: 20,
            padding: 2,
            overflow: "hidden",
          },
        ]}
      >
        <View style={[globalstyles.rowWide]}>
          <Icon name={iconName} size={iconSize} color={iconColor} />

          <Text
            style={[
              {
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                alignSelf: "flex-end",
              },
            ]}
          >
            {content}
          </Text>
        </View>
        <Text
          style={[
            {
              color: "#fff",
              fontSize: 11,
              alignSelf: "flex-start",
              paddingVertical: 5,
            },
          ]}
        >
          {header}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView 
       showsVerticalScrollIndicator={false}  
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <View
          style={[
            globalstyles.columnStart,
            { paddingHorizontal: 20, paddingVertical: 4 },
          ]}
        >       
        <View style={[globalstyles.row,{
          gap:10
          }]}>
              <Text  
              
              style={[{
                color: theme.text,
                fontSize:18,
                fontFamily:'Poppins-Bold',
            
              }]}>
              Hi  {userData?.full_name ? userData.full_name.slice(0,18):''}
              </Text>    
              <HelloWave
                 helloStyle = {{paddingHorizontal:1}}
                 helloStyleText = { {
                  fontSize: 15,
                  lineHeight:18,
                }}
              />     
          </View>
    
          <Text
            style={{
              color: "green",
              fontSize: 20,
              fontFamily: "Poppins-Bold",
            }}
          >
            {userData.account_type == 'recruiter'
              ? 'Find Job Seekers Here'
              :'Find Your Dream Job Here'
            }


            
          </Text>
        </View>

        <View
          style={[
            {
              borderRadius: 30,
              padding: 10,
              alignSelf: "center",
              backgroundColor: "rgba(0,80,51,0.8)",
              width: "90%",
              marginBottom: 5,
            },
          ]}
        >
          <Text
            style={[
              {
                color: "#fff",
                textAlign: "center",
                fontWeight: "500",
                padding: 10,
              },
            ]}
          >
            My Analytics
          </Text>

          <View style={[globalstyles.rowEven, { overflow: "hidden" }]}>
            <Pressable
              onPress={goToJobs}
              style={[
                globalstyles.row,
                {
                  overflow: "hidden",
                  width: "70%",
                  gap: 10,
                  paddingHorizontal: 10,
                  flexWrap: "wrap",
                },
              ]}
            >
              <Text style={[{ color: "#fff", fontSize: 12, padding: 10 }]}>
                {userData.account_type == "recruiter"
                  ? "Posts"
                  : "Job \n applications"}
              </Text>
              <Text
                style={[
                  {
                    fontSize: 30,
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#fff",
                  },
                ]}
              >
                {analytics?.posts ? analytics.posts : "0"}
              </Text>
            </Pressable>

            <View style={[globalstyles.column, { width: "30%" }]}>
              <View style={[globalstyles.rowWide]}>
                <Text style={[{ color: "#fff" }]}>Open</Text>
                <Text
                  style={[
                    {
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: 12,
                      alignSelf: "flex-end",
                    },
                  ]}
                >
                  {analytics?.open ? analytics.open : "0"}
                </Text>
              </View>

              <View style={[globalstyles.rowWide]}>
                <Text style={[{ color: "#fff" }]}>Closed</Text>
                <Text
                  style={[
                    {
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: 12,
                      alignSelf: "flex-end",
                    },
                  ]}
                >
                  {analytics?.closed ? analytics.closed : "0"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              globalstyles.rowEven,
              { overflow: "hidden", flexWrap: "wrap" },
            ]}
          >
            <Menu
              header="Profile visits"
              content={analytics?.profilevisits ? analytics.profilevisits : "0"}
              iconColor="#fff"
              iconSize={14}
              iconName="users"
              Icon={FontAwesome}
            />
            <Menu
              header="Impressions"
              content={analytics?.impressions ? analytics.impressions : "0"}
              iconColor={"red"}
              iconSize={14}
              iconName="bar-chart"
              Icon={MaterialIcons}
            />

            <Menu
              header="Search Appearances"
              content={analytics?.searches ? analytics.searches : "0"}
              iconColor="rgb(255,255,245)"
              iconSize={14}
              iconName="search"
              Icon={MaterialIcons}
            />
            <Menu
              header="Job Reviews"
              content={analytics?.reviews ? analytics.reviews : "0"}
              iconColor="orange"
              iconSize={14}
              onPress={goToReviews}
              iconName="reviews"
              Icon={MaterialIcons}
            />
          </View>
        </View>

        { jobposts && jobposts.length > 0 &&
        <View
          style={[
            globalstyles.rowWide,
            { paddingHorizontal: 20, paddingVertical: 10 },
          ]}
        >
          <Text style={{ fontSize: 19, fontWeight: 700, color: theme.text }}>
            {userData.account_type == "recruiter"
              ? "My Jobs"
              : "Recommendations"}
          </Text>

          <Pressable onPress={()=> userData.account_type == 'recruiter' ? router.push('/(app)/(home)/(jobpost)') : router.push('/(app)/(search)/(jobs)')}>
            <Text
              style={{ color:'#777', fontSize: 18, fontWeight: "500" }}
            >
              More...
            </Text>
          </Pressable>
        </View>
        }

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={jobposts}
          renderItem={({ item, index }: { item: any; index: number }) => {
            const { dat, time } = dateFormater(item?.date_posted);
            return (
              <TouchableOpacity
                onPress={()=>router.push({pathname:'/(app)/(search)/(jobs)/job-profile',
                  params:{post_id:item.post_id}
                  })}
                key={index}
                style={[
                  {
                    backgroundColor: theme.card,
                    elevation: 3,
                    marginHorizontal: 20,
                    marginBottom: 10,
                    borderRadius: 10,
                    padding: 10,
                    width: Dimensions.get("window").width - 80,
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
                    {item?.recruiter?.profile_picture ? (
                      <Image
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          objectFit: "cover",
                        }}
                        source={{ uri: item.recruiter.profile_picture }}
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
                          {item?.recruiter?.full_name?.slice(0, 1)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{ overflow: "hidden", width: "50%" }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontWeight: "500",
                        color: theme.text,
                        paddingVertical: 8,
                      }}
                    >
                      {item?.recruiter?.full_name ? item.recruiter.full_name :''}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ fontWeight: "500", fontSize: 13, color: "#888" }}
                    >
                      @{item?.recruiter?.username ? item.recruiter.username : ''}
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
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: theme.text,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    fontSize: 18,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  {item?.title}
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
                  

                  <RenderButtonRow
                    Icon={AntDesign}
                    icon_color={theme.text}
                    icon_name="rightcircle"
                    icon_size={28}
                    buttonStyles={{}}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          onPress={() => router.push(
            userData.account_type=='recruiter'?
            "/(app)/(home)/(jobpost)/create-post" :
            "/(app)/(home)/(jobapplications)"
          
          )}
          style={[
            globalstyles.row,
            {
              gap: 23,
              backgroundColor: "rgb(1,100,51)",
              marginVertical: 20,
              borderRadius: 20,
              paddingVertical: 5,
              width: "80%",
              justifyContent: "center",
              alignSelf: "center",
            },
          ]}
        >
          <Text style={{ color: "#fff", alignSelf: "center" }}>
             {
              userData.account_type=='recruiter'? 
              "Create Job Post": "My Job Applications"
             }
           
          </Text>

          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: theme.text,
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          { userData?.account_type && userData?.account_type == "recruiter"
            ? "People around me"
            : "Jobs around me"}
        </Text>

        <View
          style={{
            width: "90%",
            height: 300,
            alignSelf: "center",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
         <MapViewer
              // handleMapPress={mapPointPress}
               initialRegion={userLocation}
              >
                {userLocation && userData.account_type == 'jobseeker' &&
                <MapMarker
                    latitude={userLocation.latitude}
                    longitude={userLocation.longitude}
                    title={userData.full_name}
                    industry={userData.industry}
                    description={userData.bio}
                    theme={theme}
                    person={true}
                    imageSource={userData.profile_picture}
                    // onPress={()=>goToScreen(item)}
                  />
                  }

                {mapsData.length >0 && mapsData.map((item: any, index: number) => (
                  <MapMarker
                    key={index}
                    goToProfile={()=>goToScreen(item)}
                    latitude={item.latitude}
                    longitude={item.longitude}
                    person={ userData.account_type == 'recruiter' && userData.user_id == item.user_id ? true: false}
                    title={ userData.account_type == 'recruiter' ?  item.full_name: item.title}
                    industry={item.industry}
                    description={ userData.account_type == 'recruiter' ? item.bio :item.description}
                    theme={theme}
                    imageSource={ userData.account_type == 'recruiter' ?  item.profile_picture : item.job_picture}
                    // onPress={()=>goToScreen(item)}
                  />
                ))}
              </MapViewer>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(app)/(search)')}
          style={[
            globalstyles.row,
            {
              borderColor: "red",
              gap: 23,
              borderWidth: 1,
              marginVertical: 20,
              borderRadius: 20,
              paddingVertical: 5,
              width: "80%",
              justifyContent: "center",
              alignSelf: "center",
            },
          ]}
        >
          <Text
            style={{
              color: theme.text,
              alignSelf: "center",
              fontWeight: "600",
            }}
          >
            Full Maps
          </Text>

          <FontAwesome name="map-marker" size={24} color="red" />
        </TouchableOpacity>
      </ScrollView>
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
