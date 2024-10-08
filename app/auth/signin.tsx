import { Input } from "@/components/Inputs";
import Toast from "@/components/Toast";
import {
  useGetResourceMutation,
  usePostNoAuthMutation,
} from "@/store/services/authApi";
import { setTokens, setUser, setAuth } from "@/store/slices/authSlice";
import { clearModal, rendermodal } from "@/store/slices/modalSlice";
import { useAppDispatch } from "@/store/store";
import { globalstyles } from "@/styles/styles";
import { removeSpace } from "@/utils/utils";
import { validationBuilder } from "@/utils/validator";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, TouchableOpacity,Text,Image } from "react-native";
import { useSelector } from "react-redux";

const SigninScreen = ({navigation}:any) => {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const {authError} = useSelector((state: any) => state.auth);
  
  const [getUserData, { isLoading, isError, error, isSuccess }] = useGetResourceMutation();
  const [handleLogin,{ isLoading: isLogginIn, isError: existsLoginError, error: passError }] = usePostNoAuthMutation();

  const [passwordError, setPasswError] = useState("");
  const [emailError, setemailError] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [focus, setFocused] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  async function loginUser() {
    if (!isLogginIn) {
      rendermodal({
        dispatch: dispatch,
        header: "Info",
        status: "info",
        content: "Login started, validating credentials ...",
      });
      try {
        const validationData = [
          {
          email:email,
          minlength:11, 
          type:'email',
          canBeEmpty:false
        },
        {
          password:password,
          minlength:3, 
          type:'string',
          canBeEmpty:false
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
                status: "info",
                content: "Login was successful Please Wait!",
              });
            await dispatch(setTokens(response));
            const user = await getUserData({ endpoint: "/profile/" }).unwrap();
            user &&
              closeModal() &&
              (await dispatch(setUser(user[0]))) &&
              (await dispatch(setAuth(true)));
          } else {
           
          }
        } else {
          throw new Error("Please Use Valid Credentials");
        }
      } catch (error: any) {
        rendermodal({
          dispatch: dispatch,
          header: "Warning!",
          status: "warning",
          content: error.message,
        });
      }
    }
  }

  function goToScreen(screen:string){
    navigation.navigate(screen)
  }

  useEffect(()=>{
    existsLoginError &&
    rendermodal({
      dispatch: dispatch,
      header: "Error!",
      status: "error",
      content: "No Account Found Matching Credentials",
    });
  },[existsLoginError])

  useEffect(() => {
    email && removeSpace(email).length < 11
      ? setemailError("Incorrect email")
      : setemailError("")
    password && removeSpace(password).length < 8
      ? setPasswError("Please Check Password")
      :  setPasswError("")
  }, [email, password])

  return (
    <SafeAreaView
      style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
      <View
        style={[
          globalstyles.card,
          {backgroundColor: theme.background },
        ]}
      >
        <View style={[{ alignSelf: "center",paddingVertical:30 }]}>
        <Image
          style={{ 
            borderRadius:40,
            width:80,
            height:80}}

          source={require("../../assets/images/icon.png")}
        />
      </View>

        {Input({
          theme: theme,
          value: email,
          onChangeText: (val) => setEmail(val),
          setFocus: setFocused,
          maxLength: 11,
          focus: focus,
          Icon: AntDesign,
          icon_name: "user",
          placeholder: "Email",
          current: "email",
          errorMessage: emailError,
        })}

        {Input({
          theme: theme,
          value: password,
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
          errorMessage: passwordError,
        })}

        <TouchableOpacity
          onPress={loginUser}
          style={[
            {
              backgroundColor: "green",
              paddingBottom: 7,
              width: "80%",
              alignSelf: "center",
              marginVertical:8
            }
          ]}
        >
          <Text style={[{color:'green'}]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>goToScreen('Reset Password')}
          style={[{marginVertical:8}]}
        >
          <Text style={[{color:'green'}]}>Forgot Password?</Text>
        </TouchableOpacity>

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
