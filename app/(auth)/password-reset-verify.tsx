import { TaggedInput } from "@/kazisrc/components/Inputs";
import Toast from "@/kazisrc/components/Toast";
import { usePostNoAuthMutation } from "@/kazisrc/store/services/authApi";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { removeSpace } from "@/kazisrc/utils/utils";
import { validationBuilder } from "@/kazisrc/utils/validator";
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector } from "react-redux";

const LoginPasswordResetScreen = ({ navigation, route }: any) => {
  const params = useGlobalSearchParams();
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);

  const [postData, { isSuccess, isError, isLoading }] = usePostNoAuthMutation();
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );

  const [focusedItem, setFocusedItem] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setpasswordRepeat] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState("");

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  async function handlePasswordChange() {
    if (!isLoading) {
      try {
        const rules = [
          {
            new_password: password,
            minLength: 5,
            type: "password",
          },
        ];
        const data:any = validationBuilder(rules);
        const {otp, mobile_number} = params
        otp ? data['code'] = otp : null
        mobile_number ? data.push({mobile_number:mobile_number}) : null
        const resp = await postData({
          data: data,
          endpoint: "/password-reset/confirm/",
        }).unwrap()
        if (resp) {
          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "Your password has been changed"
          })
          router.replace('/(auth)/')
        } 
      } catch (error: any) {
        setErrors(error);
      }
    }
  }

  useEffect(() => {
    if (password && passwordRepeat) {
      password !== passwordRepeat
        ? setErrorMessage("Passwords Do not Match")
        : setErrorMessage("");
    }
  }, [password, passwordRepeat]);

  useEffect(() => {
    if (isError)
      rendermodal({
        dispatch: dispatch,
        header: "Error!",
        status: "error",
        content: "An error occurred while trying to update password.\n Try again later",
      });
  }, [isError]);

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[globalstyles.card, { backgroundColor: theme.card }]}>
          <Text style={[{ color: theme.text, fontSize: 20, padding: 20 }]}>
            ** Update Your Password
          </Text>
          <TaggedInput
            onFocus={() => setFocusedItem("repeat")}
            onBlur={() => setFocusedItem("")}
            secureTextEntry={true}
            taggedInputContainerStyles={
              focusedItem == "repeat" && { borderColor: "green" }
            }
            value={password}
            maxLength={30}
            errorMessage={errors.password ? errors.password : ""}
            onChangeText={(val) => setPassword(val)}
            placeholder="ex 89ss$5sfy6"
            caption={"New Password"}
          />

          <TaggedInput
            onFocus={() => setFocusedItem("repeat")}
            onBlur={() => setFocusedItem("")}
            taggedInputContainerStyles={
              focusedItem == "repeat" && { borderColor: "green" }
            }
            secureTextEntry={true}
            value={passwordRepeat}
            errorMessage={errors.passwordRepeat ? errors.passwordRepeat : ""}
            maxLength={30}
            onChangeText={(val: any) => setpasswordRepeat(val)}
            placeholder="ex 89ss$5sfy6"
            caption={"Repeat Password"}
          />
        </View>

        <View style={{ width: "80%", padding: 20 }}>
          <Text style={{ color: "red" }}> {errorMessage}</Text>
        </View>

        <TouchableOpacity
          onPress={handlePasswordChange}
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
            Change Password
          </Text>
        </TouchableOpacity>

        <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
export default LoginPasswordResetScreen;
