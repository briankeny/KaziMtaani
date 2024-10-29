import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import { TaggedInput } from "@/kazisrc/components/Inputs";
import { usePatchFormDataMutation } from "@/kazisrc/store/services/authApi";
import { setUser } from "@/kazisrc/store/slices/authSlice";
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
} from "react-native";
import { useSelector } from "react-redux";

export default function EditAccountScreen() {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { userData } = useSelector((state: any) => state.auth);

  const [patchData, {}] = usePatchFormDataMutation();

  const { bio, profile_picture, user_id, full_name, username } = userData;

  const [new_name, setNewName] = useState<string>("");
  const [user_name, setUserName] = useState<string>("");
  const [new_bio, setBio] = useState<string>("");
  const [profile_pic, setProfilePic] = useState<string | null>("");
  const [new_pic, setNewpic] = useState<boolean>(false);
  const [imageType, setImageType] = useState<string | any>("png");

  const [errors, setErros] = useState<any>({});
  const [focused, setFocus] = useState<string>("");

  useEffect(() => {
    bio && setBio(bio);
    full_name && setNewName(full_name);
    username && setUserName(username);
  }, []);

  useEffect(() => {
    profile_picture && setProfilePic(profile_picture);
  }, [profile_picture]);

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
          minLength: 3,
        },
        {
          bio: new_bio,
          type: "string",
          minLength: 8,
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
        uploadname: ["job_picture"],
      });
      const resp: any = await patchData({
        data: dataToSubmit,
        endpoint: `/user/${user_id}/`,
      }).unwrap();
      if (resp) {
        resp.data && dispatch(setUser(resp.data));
        router.replace("/(app)/(profile)/");
      }
    } catch (error: any) {}
  }

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      <TouchableOpacity
        onPress={selectImage}
        style={{
          width: 200,
          height: 200,
          marginVertical: 10,
          overflow: "hidden",
          borderRadius: 100,
          backgroundColor: "orange",
          alignSelf: "center",
        }}
      >
        {" "}
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
          <View style={[globalstyles.columnCenter]}>
            <MaterialCommunityIcons
              name="image-plus"
              size={24}
              color={theme.text}
            />
            <Text style={{ color: theme.text, textAlign: "center" }}>
              Pick Image
            </Text>
          </View>
        )}
      </TouchableOpacity>

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
          globalstyles.rowEven,
          {
            borderColor: "red",
            borderWidth: 1,
            borderRadius: 20,
            position: "absolute",
            right: 10,
            top: 20,
            padding: 10,
          },
        ]}
      />

      <View style={[globalstyles.card]}>
        <TaggedInput
          onChangeText={(val: any) => setNewName(val)}
          onBlur={() => setFocus("")}
          onFocus={() => setFocus("pass")}
          taggedInputContainerStyles={{
            padding: 5,
            borderColor: focused == "pass" ? "orange" : "#888",
          }}
          value={new_name}
          secureTextEntry={true}
          caption="Name"
          errorMessage={errors?.new_name ? errors.new_name : ""}
          placeholder="Your full name here: ex John Davis"
        />

        <TaggedInput
          onChangeText={(val: any) => setUserName(val)}
          onBlur={() => setFocus("")}
          onFocus={() => setFocus("uname")}
          taggedInputContainerStyles={{
            padding: 5,
            borderColor: focused == "uname" ? "orange" : "#888",
          }}
          value={user_name}
          secureTextEntry={true}
          caption="Username"
          errorMessage={errors.user_name ? errors?.user_name : ""}
          placeholder="User name ex johnxxKe_254"
        />

        <TaggedInput
          onChangeText={(val: any) => setBio(val)}
          onBlur={() => setFocus("")}
          onFocus={() => setFocus("bio")}
          taggedInputContainerStyles={{
            padding: 5,
            borderColor: focused == "bio" ? "orange" : "#888",
          }}
          value={new_bio}
          secureTextEntry={true}
          caption="Bio"
          errorMessage={errors?.new_bio ? errors.new_bio : ""}
          placeholder="Tell us about who you are and what you do"
        />

        <TouchableOpacity
          onPress={updateProfile}
          style={[
            globalstyles.columnCenter,
            {
              backgroundColor: "#b35900",
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
      </View>
    </SafeAreaView>
  );
}
