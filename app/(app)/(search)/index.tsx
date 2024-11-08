import BottomSheetDrawer from "@/kazisrc/components/BottomSheetDrawer";
import MapMarker from "@/kazisrc/components/MapMarker";
import MapViewer from "@/kazisrc/components/MapViewer";
import Toast from "@/kazisrc/components/Toast";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { clearModal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  TouchableOpacity,Image,
  View,
  Text,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";

export default function SearchScreen() {
  const dispatch = useAppDispatch();
  const { userData,myLocation } = useSelector((state: any) => state.auth);
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );

  const [getUserData, { isLoading: userLoading, data:peopleData }] =
    useGetResourceMutation({ fixedCacheKey: "people_search" });
  const [getjobsData, { isLoading, data: jobsData }] = useGetResourceMutation({fixedCacheKey:'jobs_search'});
  const [getData, { isLoading:getLoading }] = useGetResourceMutation();
  const [categories, setCategories] = useState([])
  const [mapsData, setMapsData] = useState<any>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openMaps, setOpenMaps] = useState<boolean>(true);
  const snapPoints = useMemo(() => ["10%", "25%", "50%", "75%", "100%"], []);
 
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA =  2; //Very high zoom level
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  async function fetchCategories() {
    try{
      const resp = await getData({endpoint:'/jobs/'}).unwrap()
      if(resp)
       setCategories(resp.results)
    }
    catch(error:any){

    }
  }

  async function fetchJobs() {
    try {
    await getjobsData({ endpoint: `/job-posts/`}).unwrap()
      
    } catch (error: any) {}
  }

  const [userLocation, setUserLocation] = useState<any>({
    latitude: -1.5256749,
    longitude: 36.9396504,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  function mapAction() {}

  function mapPointPress(event: any) {
    // console.log(event)
    // const { latitude, longitude } = event.nativeEvent.coordinate;
    // console.log("Choose location", latitude, longitude);
  }

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  useEffect(()=>{
    fetchJobs()
    fetchCategories()
  },[])

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

  useEffect(()=>{
    peopleData &&  userData.account_type == 'recruiter' && setMapsData(peopleData.results)
   jobsData &&   userData.account_type != 'recruiter' &&  setMapsData(jobsData.results)
  },[peopleData,userData,jobsData])
 

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[globalstyles.column]}>
        <Text
          style={{
            color: theme.text,
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontFamily: "Poppins-Bold",
          }}
        >
          People
        </Text>
        <TouchableOpacity
           onPress={()=>router.push('/(app)/(search)/(people)')}
          style={[
            globalstyles.card,
            { height: "35%",width:'88%', 
              paddingHorizontal:0,paddingVertical:0,
              paddingLeft:10,
              backgroundColor: "rgba(255, 117, 26,0.6)",overflow:'hidden' },
          ]}
        >
                <Text style={{color:'#fff', fontFamily:'Poppins-Bold', 
                  textAlign:'center',
                  paddingTop:10}}>Find People Around Me</Text>

            <View style={[globalstyles.row,{
              borderRadius:20,
            height:'75%',
            overflow:'hidden',
            width:'80%',
              alignSelf:'center',position:'absolute',bottom:10}]}>
                  <Image
                    source={{uri:"https://www.shutterstock.com/image-photo/group-happy-clothing-factory-workers-600nw-221455681.jpg"}}
                    style={{
                      height:'100%',
                      width:'100%',
                      objectFit:'cover',
                    }}
                  /> 
              </View>
        </TouchableOpacity>

        <Text
          style={{
            color: theme.text,
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontFamily: "Poppins-Bold",
          }}
        >
          Jobs
        </Text>
        <TouchableOpacity
           onPress={()=>router.push('/(app)/(search)/(jobs)/')}
          style={[
            globalstyles.card,,globalstyles.rowWide,
            { height: "35%",width:'88%', 
              paddingHorizontal:0,paddingVertical:0,
              paddingLeft:10,
              backgroundColor: "rgba(25, 77,51,0.8)",overflow:'hidden'},
          ]}
        >
             <View  style={{width:'40%',overflow:'hidden'}}>
                <Text style={{color:'#fff', fontFamily:'Poppins-Bold', paddingTop:10}}>Search For</Text>

                <View 
                style={[globalstyles.row,{gap:4, flexWrap:'wrap',height:'75%',
                paddingVertical:10,overflow:'hidden'}]}>
                  {categories.length > 0 && categories.map((item:any,index:number)=>
                      <Text
                       ellipsizeMode="tail"
                      key={index}
                      style={{color:'#fff', fontSize:9 ,fontWeight:'500'}}>
                        {item.job_name},
                     </Text>
                )     
                  }
                </View>
              
            
            </View>

              <View style={{width:'60%',height:'100%',
              borderTopLeftRadius:12,
              borderTopStartRadius:20,
              overflow:'hidden',
              borderBottomLeftRadius:200

              }}>
                  <Image
                    source={{uri:"https://www.shutterstock.com/image-photo/two-african-expert-engineers-red-260nw-2112792197.jpg"}}
                    style={{
                      height:'100%',
                      width:'100%',
                      objectFit:'cover',
                      aspectRatio:5/3}}
                  /> 
              </View>

        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setOpenMaps(true)}
        style={[
          globalstyles.row,
          {
            borderColor: "red",
            gap: 23,
            position: "absolute",
            bottom: 0,
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
        <AntDesign name="up" size={24} color={theme.text} />

        <Text
          style={{
            color: theme.text,
            alignSelf: "center",
            fontWeight: "600",
          }}
        >
          Drag Map Up
        </Text>

        <FontAwesome name="map-marker" size={24} color="red" />
      </TouchableOpacity>

      {openMaps && (
        <BottomSheetDrawer
          index={openMaps ? 1 : -1}
          snapPoints={snapPoints}
          handleClose={() => setOpenMaps(false)}
          bottomSheetRef={bottomSheetRef}
        >
          <View
            style={{
              width: "96%",
              alignSelf:'center',
              height: Dimensions.get("window").height-200,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
               <Text
          style={{
            fontSize: 19,
            color: 'rgba(0,105,0,0.8)',
            fontFamily:'Poppins-Bold',
            textAlign:'center',
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          { userData?.account_type && userData?.account_type == "recruiter"
            ? "People around me"
            : "Jobs around me"}
        </Text>
            <MapViewer
              handleMapPress={mapPointPress}
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

               { mapsData&& mapsData.length >0 && mapsData.map((item: any, index: number) => (
                  <MapMarker
                    key={index}
                    latitude={item.latitude}
                    longitude={item.longitude}
                    person={ 
                      userData.account_type == 'recruiter' ? 
                      userData.user_id == item.user_id ? true: false: 
                      false}
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
