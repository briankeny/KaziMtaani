import React,{useState,useEffect} from "react";
import { TaggedInput } from "@/kazisrc/components/Inputs";
import Toast from "@/kazisrc/components/Toast";
import { usePostNoAuthMutation } from "@/kazisrc/store/services/authApi";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch, useSelector } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { checkStrForPurelyNumbers, validationBuilder } from "@/kazisrc/utils/validator";
import { SafeAreaView, View, TouchableOpacity,Text } from "react-native";

const PasswordResetScreen = () => {
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );

    const [postData,{ isLoading, isError, error,isSuccess}] = usePostNoAuthMutation();

    const [mobile_number, setMobileNumber] = useState<string>('')
    const [errors , setErrors] = useState<any>({})
    const [focused ,setFocus] = useState<string>('')

    function handleNumeric(val:string,setterFunc:any){
        const clean = checkStrForPurelyNumbers(val)
          setterFunc(clean)
      }

    async function  sendResetLink() {
        if(!isLoading){
        try{
            const rules = [{
                mobile_number:mobile_number,
                type:'phonenumber',
                maxLength:8
            }
            ]
            
            const validated = validationBuilder(rules)

            if(validated){
                await  postData({data:validated,endpoint:'/password-reset/'}).unwrap()
            }
        }
        catch(error:any){
            setErrors(error)
        }
    }
    }

    function closeModal() {
        dispatch(clearModal());
        return true;
    }

    useEffect(()=>{
      isSuccess || isError &&   
         rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "Your password reset instructions have been sent to your phone number and email.Please Check",
          });
    },[isSuccess,isError])
    
  return (
    <SafeAreaView
      style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
        
        <View style={[globalstyles.column]}>
            <Text
            style={{color:theme.text,textAlign:'center'}}
            > 
            ** Use a phone number linked to your account.{'\n'}
            If your phone number is 0721 or 0751 start with 721 or 751
            </Text>
        <View>

        </View>
        
        <TaggedInput
          onChangeText={(val)=>handleNumeric(val,setMobileNumber)}
          keyboardType={'numeric'}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('mobile_number')}
          maxLength={6}
          taggedInputContainerStyles={{
            padding:5,
            marginVertical:35,
            borderColor:focused == 'mobile_number'?'orange':'#888'}}
          value={mobile_number}
          errorMessage={errors.mobile_number? errors.mobile_number.message : ''}
          caption='Phone Number'
          placeholder="ex +254 712 xxx xxx"
        />
            <TouchableOpacity
            onPress={sendResetLink}
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
        </View>
            <Toast
            visible={openModal}
            status={modalStatus}
            onPress={() => closeModal()}
            modalHeader={modalHeader}
            modalContent={modalContent}
            />
    </SafeAreaView>
  )
}

export default PasswordResetScreen

