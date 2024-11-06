import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { TaggedInput } from "@/kazisrc/components/Inputs";
import { usePatchFormDataMutation } from "@/kazisrc/store/services/authApi";
import { setLocation, setUser } from "@/kazisrc/store/slices/authSlice";
import { rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import {
  imageAndBodyConstructor,
  pickImage,
  randomKeyGenerator,
  removeSpace,
} from "@/kazisrc/utils/utils";
import { validationBuilder } from "@/kazisrc/utils/validator";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";

export default function EditAccountScreen() {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { userData } = useSelector((state: any) => state.auth);

  const [patchData, {isLoading,isSuccess,isError,error}] = usePatchFormDataMutation();

  const { bio, profile_picture, user_id, full_name, username,industry,location } = userData;

  const [new_name, setNewName] = useState<string>("");
  const [user_name, setUserName] = useState<string>("");
  const [new_industry,setIndustry] = useState<string>("")
  const [new_bio, setBio] = useState<string>("");
  const [profile_pic, setProfilePic] = useState<string | null>("");
  const [new_pic, setNewpic] = useState<boolean>(false);
  const [imageType, setImageType] = useState<string | any>("png");
  const [new_location , setNewlocation] = useState <string>("");

  const [errors, setErros] = useState<any>({});
  const [focused, setFocus] = useState<string>("");
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
       router.back();
    }, 2000);
  }, [router]);

  useEffect(() => {
    bio && setBio(bio);
    full_name && setNewName(full_name);
    username && setUserName(username);
    industry && setIndustry(industry);
    location && setNewlocation(location);
    profile_picture && setProfilePic(profile_picture);
    
  }, []);

  async function selectImage() {
    try {
      const result = await pickImage();
      if (!result.canceled) {
        const img = result?.assets[0]?.uri ? result.assets[0].uri : ''
        const imgtype = img ?  img.split('.')[-1] : ''
        img &&  setNewpic(true);
        img && setProfilePic(img);
        imgtype && setImageType(imageType)
      }
    } catch (error: any) {}
  }

  function clearImage() {
    setNewpic(false);
    setProfilePic(null);
  }

  async function updateProfile() {
   if(!isLoading){
    try {
      const rules = [
        {
          full_name: new_name,
          type: "string",
          minLength: 8,
        },
        {
          username: user_name,
          type: "string",
          minLength: 3
        },
        {
          industry:new_industry,
          type:'string',
          minLength :2
        },
        {
          bio: new_bio,
          type: "string",
          minLength: 8
        },
      ];
      const validated = validationBuilder(rules);
      const images = [];
      if (new_pic) {
        const img = {
          uri: profile_pic,
          name: `${removeSpace(
            userData.full_name
          )}${randomKeyGenerator()}.${imageType}`,
          type: `image/${imageType}`,
        };
        images.push(img);
      }
      const dataToSubmit = imageAndBodyConstructor({
        content: validated,
        images: images,
        uploadname: ["profile_picture"],
      });
      const resp: any = await patchData({
        data: dataToSubmit,
        endpoint: `/user/${user_id}/`,
      }).unwrap();
      if (resp) {
        rendermodal({
          dispatch: dispatch,
          header: "Success!",
          status: "success",
          content: "Your Profile Has Been Updated!",
        })
        resp ? dispatch(setUser(resp)) : null
        router.back()
      }
    } catch (error: any) {
      setErros(error)
    }
  }
  }

  useEffect(()=>{
    if(isError){
        rendermodal({
            dispatch: dispatch,
            header: "Error!",
            status: "error",
            content: "Could not update profile please try again later!",
          })
    }
    },[isError])

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
      <TouchableOpacity
        onPress={selectImage}
        style={{
          width: 200,
          height: 200,
          marginVertical: 10,
          overflow: "hidden",
          borderRadius: 100,
          backgroundColor: 'rgba(0,0,0,0.2)',
          alignSelf: "center",
        }}
      >
        {profile_pic ? (
          <Image
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              objectFit: "contain",
            }}
            source={{ uri: profile_pic }}
          />
        ) : (
          <View style={[globalstyles.columnCenter,{paddingTop:30}]}>
            <MaterialCommunityIcons
              name="image-plus"
              size={64}
              color={theme.text}
            />
            <Text style={{ color: theme.text, textAlign: "center",paddingVertical:8 }}>
              Pick passport Image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {new_pic &&
      <RenderButtonRow
        Icon={MaterialCommunityIcons}
        icon_name="delete"
        icon_color="red"
        icon_styles={{ color: "red" }}
        icon_size={24}
        buttonTextStyles={{ color: theme.text }}
        action={clearImage}
        button_text="Remove Image"
        buttonStyles={[
          globalstyles.row,
          { alignSelf:'center',
            borderColor: "red",
            borderWidth: 1,
            marginVertical:10,
            borderRadius: 20,
            paddingHorizontal: 10,
          },
        ]}
      />
      }

      <View style={[globalstyles.card,{backgroundColor:theme.card}]}>
        <TaggedInput
          onChangeText={(val: any) => setNewName(val)}
          onBlur={() => setFocus("")}
          onFocus={() => setFocus("pass")}
          maxLength={50}
          taggedInputContainerStyles={{
            padding: 5,
            borderColor: focused == "pass" ? "orange" : "#888",
          }}
          value={new_name}
          caption="Name"
          errorMessage={errors?.new_name ? errors.new_name : ""}
          placeholder="Your full name here: ex John Davis"
        />

        <TaggedInput
          maxLength={25}
          onChangeText={(val: any) => setUserName(val)}
          onBlur={() => setFocus("")}
          onFocus={() => setFocus("uname")}
          taggedInputContainerStyles={{
            padding: 5,
            borderColor: focused == "uname" ? "orange" : "#888",
          }}
          value={user_name}
          caption="Username"
          errorMessage={errors.username ? errors?.username : ""}
          placeholder="User name ex johnxxKe_254"
        />


        <TaggedInput
          onChangeText={(val: any) => setIndustry(val)}
          onBlur={() => setFocus("")}
          maxLength={100}
          onFocus={() => setFocus("ind")}
          taggedInputContainerStyles={{
            padding: 5,
            borderColor: focused == "ind" ? "orange" : "#888",
          }}
          value={new_industry}
          caption= { userData.account_type == "recruiter" ?"Industry" :"Profession"}
          errorMessage={errors.industry ? errors?.industry : ""}
          placeholder="Write your industry or profession here..."
        />


      <TaggedInput
          onChangeText={(val: any) => setNewlocation(val)}
          onBlur={() => setFocus("")}
          onFocus={() => setFocus("location")}
          maxLength={250}
          taggedInputContainerStyles={{
            padding: 5,
            borderColor: focused == "location" ? "orange" : "#888",
          }}
          value={new_location}
          secureTextEntry={true}
          caption="Location"
          errorMessage={errors?.new_bio ? errors.new_bio : ""}
          placeholder="ex. Nairobi, Kenya"
        />

        <TaggedInput
          onChangeText={(val: any) => setBio(val)}
          onBlur={() => setFocus("")}
          onFocus={() => setFocus("bio")}
          maxLength={250}
          taggedInputContainerStyles={{
            padding: 5,
            minHeight:60,
            borderColor: focused == "bio" ? "orange" : "#888",
          }}
          value={new_bio}
          secureTextEntry={true}
          caption="Bio"
          errorMessage={errors?.new_bio ? errors.new_bio : ""}
          placeholder="Tell us about you and what you do"
        />

      </View>

      <TouchableOpacity
          onPress={updateProfile}
          style={[
            globalstyles.columnCenter,
            {
              backgroundColor: "rgba(0,105,0,1)",
              width: "80%",
              alignSelf: "center",
              marginVertical: 12,
              height: 44,
            },
          ]}
        >
          <Text
            style={[
              {
                color: "white",
                paddingVertical: 5,
                textAlign: "center",
                fontWeight: "500",
              },
            ]}
          >
            Update Profile
          </Text>
        </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
}