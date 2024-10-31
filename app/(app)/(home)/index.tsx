import BottomSheetDrawer from "@/kazisrc/components/BottomSheetDrawer";
import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { HelloWave } from "@/kazisrc/components/HelloWave";
import MapMarker from "@/kazisrc/components/MapMarker";
import MapViewer from "@/kazisrc/components/MapViewer";
import { jobMarker, userMarker } from "@/kazisrc/images/images";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { setJobPosts } from "@/kazisrc/store/slices/jobsSlice";
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
import { router } from "expo-router";
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
} from "react-native";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const dispatch = useAppDispatch()
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const {jobposts} = useSelector((state:any)=>state.jobs);
  const { userData, authentication } = useSelector((state: any) => state.auth);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [getData, { isLoading:getLoading, isError:existsGetError, error:getError, isSuccess:getSuccess }] =
    useGetResourceMutation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(false);
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "100%"], []);
  const [getJobsData, {isLoading, isError, error, isSuccess }] = useGetResourceMutation({fixedCacheKey:'my-jobs'});

  async function fetchJobs() {
      try {
        const resp = await getData({ endpoint: "/job-posts/" }).unwrap();
        if (resp) {
          const data = resp.results ? resp.results : [];
          dispatch(setJobPosts(data));
        }
      } catch (error: any) {}
  }


  async function fetchDataAnalytics() {
    try {
      const resp = await getJobsData({ endpoint: "/analytics/" }).unwrap();
      if (resp) {
        resp.data && setAnalytics(resp.data);
      }
    } catch (error) {}
  }

  function mapAction() {
    console.log("Clicked");
  }

  useEffect(()=>{
    fetchJobs()
    fetchDataAnalytics()

  },[])


  const Menu = ({
    Icon,
    iconSize = 24,
    iconColor = "#888",
    header = "",
    content = "",
    iconName = "",
  }: any) => {
    return (
      <View
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
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView>
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
            Find Your Dream Job Here
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
            <View
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
            </View>

            <View style={[globalstyles.column, { width: "30%" }]}>
              <View style={[globalstyles.rowWide]}>
                <Text style={[{ color: "#fff" }]}>Open</Text>
                <Text
                  style={[
                    {
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: 16,
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
                      fontSize: 16,
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

          <Pressable onPress={()=> userData.account_type == 'recruiter' ? router.push('/(app)/(home)/job-post-admin') : router.push('/(app)/(home)/job-applications')}>
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

        <Pressable
          onPress={() => router.push("/(app)/(home)/job-post-create")}
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
            Create Job Post
          </Text>

          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>

        <Text
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: theme.text,
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          {userData.account_type == "recruiter"
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
          <MapViewer>
            {testdata.map((item: any, index: number) => (
              <MapMarker
                key={index}
                mapIcon={userData.account_type == 'recruiter' ? userMarker : jobMarker}
                location={item.location}
                title={item.name}
                description="My Beatufiul"
                theme={theme}
                imageSource={item.imageSource}
                onPress={mapAction}
              />
            ))}
          </MapViewer>
        </View>

        {openBottomSheetDrawer && (
          <BottomSheetDrawer
            index={openBottomSheetDrawer ? 1 : -1}
            snapPoints={snapPoints}
            handleClose={() => setOpenBottomSheetDrawer(false)}
            bottomSheetRef={bottomSheetRef}
          >
            <View
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                alignSelf: "center",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <MapViewer>
                {testdata.map((item: any, index: number) => (
                  <MapMarker
                    key={index}
                    location={item.location}
                    title={item.name}
                    description="My Beatufiul"
                    theme={theme}
                    imageSource={item.imageSource}
                    onPress={mapAction}
                  />
                ))}
              </MapViewer>
            </View>
          </BottomSheetDrawer>
        )}

        <Pressable
          onPress={() => setOpenBottomSheetDrawer(true)}
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
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export const testdata = [
  {
    id: 1,
    name: "John Doe",
    location: { latitude: -1.5256749, longitude: 36.92189 },
    imageSource: {
      uri: "https://images.unsplash.com/photo-1640695186958-470133dee50f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }, // Local image
  },
  {
    id: 2,
    name: "Jane Smith",
    location: { latitude: -1.51, longitude: 36.82 },
    imageSource: {
      uri: "https://images.unsplash.com/photo-1640695186958-470133dee50f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }, // Remote image
  },
];
