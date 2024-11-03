import React, { useEffect, useState } from "react";
import { Input } from "@/kazisrc/components/Inputs";
import Toast from "@/kazisrc/components/Toast";
import { logo } from "@/kazisrc/images/images";
import { useGetResourceMutation, usePostNoAuthMutation } from "@/kazisrc/store/services/authApi";
import { setTokens, setUser, setAuth } from "@/kazisrc/store/slices/authSlice";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { validationBuilder, checkStrForPurelyNumbers } from "@/kazisrc/utils/validator";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, View, TextInput,Text,Image, TouchableOpacity, Pressable } from "react-native";
import { useSelector } from "react-redux";

const SigninScreen = ({navigation}:any) => {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const {authentication} = useSelector((state:any)=>state.auth)
  const [getUserData, { isLoading, isError, error, isSuccess }] = useGetResourceMutation();
  const [handleLogin,{ isLoading: isLogginIn, isError: existsLoginError, error: passError }] = usePostNoAuthMutation();
  const [showPass, setShowPass] = useState(true);
  const [focus, setFocused] = useState("");
  const [mobile_number, setMobileNo] = useState<string>('');
  const [errors,setErrors] = useState <any>({})
  const [password, setPassword] = useState("");

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  async function loginUser() {
    if (!isLogginIn) {
      try {
        const validationData = [
          {
            mobile_number: mobile_number,
            minlength:8,
            type:'phonenumber'
            },
        {
          password:password,
          minlength:6, 
          type:'string', 
        
        }]
        const validated = validationBuilder(validationData)
        if (validated) {
          const response = await handleLogin({
            data: validated,
            endpoint: "/login/",
          }).unwrap();
          if (response) {
            closeModal() &&
              rendermodal({
                dispatch: dispatch,
                header: "Success!",
                status: "success",
                content: "Login was successful Please Wait!",
              });
            await dispatch(setTokens(response));
            const user = await getUserData({ endpoint: "/profile/" }).unwrap();
            if (user){
              closeModal()
              await dispatch(setUser(user)) 
              await dispatch(setAuth(true));
            }
          }
      }
      } catch (error: any) {

       setErrors(error)
      }
    }
  }

  function handleNumeric(val:string,setterFunc:any){
    const clean = checkStrForPurelyNumbers(val)
      setterFunc(clean)
  }


  function goToScreen(screen:any){
    router.push(screen)
  }
 
  useEffect(()=>{
    if (authentication ) router.replace('/(app)')  
   },[authentication])
 

  useEffect(()=>{
    existsLoginError &&
    rendermodal({
      dispatch: dispatch,
      header: "Error!",
      status: "error",
      content: "No Account Found Matching Credentials",
    });
  },[existsLoginError])

  // useEffect(() => {
  //   password && removeSpace(password).length < 8
  //     ? setPasswError("Please Check Password")
  //     :  setPasswError("")
  // }, [password])

  useEffect(()=>{
    if(isError){
        rendermodal({
            dispatch: dispatch,
            header: "Error!",
            status: "error",
            content: "Incorrect Credentials Provided!",
          })
    }
    },[isError])

  return (
    <SafeAreaView
      style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
      <View
        style={[
          
          {backgroundColor: theme.background,marginVertical:80,height:'100%' },
        ]}
      >
        <View style={[{ alignSelf: "center",paddingVertical:30 }]}>
        <Image
          style={{ 
            borderRadius:75,
            width:150,
            height:150}}

          source={logo}
        />
      </View>

      <View style={[globalstyles.row,{width:'80%',marginVertical:30,
      gap:10,alignSelf:'center'}]}>
  
           <View style={[
            globalstyles.columnCenter,
            {width:70,height:44,
            borderRadius:10,
            borderWidth:1,borderColor:'#888'}]}>
                <Text style={[{color:theme.text,fontWeight:'500'}]}>
                  🇰🇪 {''} +254
                </Text>
           </View>
           
      
          <View>

          <TextInput
            keyboardType={'numeric'}
            onChangeText={(val) => handleNumeric(val,setMobileNo)}
            maxLength={11}
            onBlur={()=>setFocused('')}
            onFocus={()=>setFocused('mobile')}
            style={{
              padding:5,
              borderColor: focus == 'mobile' ? "#b35900":theme.text,
              color:theme.text,
              borderBottomWidth:1,
              width:190}}
            value={mobile_number}
            placeholderTextColor={'#888'}
            placeholder="Phone Number" 
          />
            {errors.mobile_number &&
            <Text style={[globalstyles.error]}>{errors.mobile_number ? 'Mobile number is incorrect' :''  }</Text>}
        </View>
      
      </View>
    

        {Input({
          theme: theme,
          value: password,
          inputStyles:{backgroundColor:'rgba(0,0,0,0.03)',borderWidth:0.5},
          secureEntry: showPass,
          showVisButton: true,
          showVisibility: setShowPass,
          onChangeText: (val) => setPassword(val),
          setFocus: setFocused,
          focus: focus,
          maxLength: 30,
          Icon: Ionicons,
          icon_name: "key-outline",
          placeholder: "Password",
          current: "passw",
          errorMessage: errors.password ? errors.password:'',
        })}

        <TouchableOpacity
          onPress={loginUser}
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
          <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Login</Text>
        </TouchableOpacity>

        <Pressable
          onPress={()=>goToScreen({pathname:'password-reset'})}
          style={[{marginVertical:8}]}
        >
          <Text style={[{color:'green',textAlign:'center'}]}>Forgot Password?</Text>
        </Pressable>

        <Pressable
          onPress={()=>goToScreen({pathname:'/signup-phone-auth'})}
          style={[{marginVertical:8}]}
        >
          <Text style={[{color:theme.text,textAlign:'center',textDecorationLine:'underline'}]}>I don't have an account?</Text>
        </Pressable>

        <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default SigninScreen;
