import { TaggedInput } from "@/kazisrc/components/Inputs";
import { logo } from "@/kazisrc/images/images";
import { usePatchFormDataMutation } from "@/kazisrc/store/services/authApi";
import { globalstyles } from "@/kazisrc/styles/styles";
import { pickImage } from "@/kazisrc/utils/utils";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Image, TouchableOpacity,Text } from "react-native";
import { useSelector } from "react-redux";

export default function EditAccountScreen() {
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { userData } = useSelector((state: any) => state.auth);

  const [patchData,{}] = usePatchFormDataMutation()

  const {bio,profile_picture,user_id,full_name,username} = userData
 
  const [new_name, setNewName] = useState<string>('')
  const [user_name, setUserName] = useState<string>('')
  const [new_bio , setBio]  = useState<string>('')
  const [profile_pic , setProfilePic] = useState<string | null>(null)
  const [new_pic ,  setNewpic] = useState<boolean>(false)
  const [errors, setErros] = useState<any>({});
  const [focused,setFocus] = useState<string>('')

  useEffect(()=>{
    bio && setBio(bio)
    profile_picture &&  setProfilePic(profile_picture)
    full_name && setNewName(full_name)
    username && setUserName(username)    
  },[])


  async function selectImage(){
    try{
        const result = await pickImage()
        
        if (!result.canceled) {
            setNewpic(true)
            setProfilePic(result.assets[0].uri)
        }
    }
    catch(error:any){

    }
  }

  function clearImage(){
    setNewpic(false)
    setProfilePic(null)
  }

  async function updateProfile() {
     try{
        const data = {}
        const resp = await patchData({data:data,endpoint:`/user/${user_id}/`})
        
        if(resp){

        }
    }
     catch(error:any){

     }
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
        <Image
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            objectFit: "contain",
          }}
          source={logo}
        />
      </TouchableOpacity>

    <View style={[globalstyles.card]}>
      <TaggedInput
            onChangeText={(val:any)=>setNewName(val)}
            onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('pass')}
                taggedInputContainerStyles={{
                  padding:5,
                  borderColor:focused == 'pass'?'orange':'#888'}}
                value={new_name}
                secureTextEntry= {true}
                caption='Name'
                errorMessage = { errors?.new_name ? errors.new_name : ''}
                placeholder="Your full name here: ex John Davis"
        />

      <TaggedInput
            onChangeText={(val:any)=>setUserName(val)}
            onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('uname')}
                taggedInputContainerStyles={{
                  padding:5,
                  borderColor:focused == 'uname'?'orange':'#888'}}
                value={user_name}
                secureTextEntry= {true}
                caption='Username'
                errorMessage = { errors.user_name ? errors?.user_name : ''}
                placeholder="User name ex johnxxKe_254"
        />

<TaggedInput
            onChangeText={(val:any)=>setBio(val)}
            onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('bio')}
                taggedInputContainerStyles={{
                  padding:5,
                  borderColor:focused == 'bio'?'orange':'#888'}}
                value={new_bio}
                secureTextEntry= {true}
                caption='Bio'
                errorMessage = { errors?.new_bio ? errors.new_bio : ''}
                placeholder="Tell us about who you are and what you do"
        />

        <TouchableOpacity
          onPress={updateProfile}
          style={[ globalstyles.columnCenter,
            {
              backgroundColor: "#b35900",
              width: "80%",
              alignSelf: "center",
              marginVertical:12,
              height:44
            }
          ]}
        >
          <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Update Profile</Text>
        </TouchableOpacity>
    </View>

        

    </SafeAreaView>
  );
}
