import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput,Text, StyleSheet,Image, SafeAreaView,TouchableOpacity, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TaggedInput } from '@/components/Inputs';
import { useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { globalstyles } from '@/styles/styles';
import { AntDesign } from '@expo/vector-icons';
import { usePostNoAuthMutation } from '@/store/services/authApi';
import { validationBuilder } from '@/utils/validator';
import { rendermodal } from '@/store/slices/modalSlice';
import { router } from 'expo-router';
import Swipper from '@/components/Swipper';
import { logo } from '@/images/images';


const SignUpScreen = () => {
  const dispatch = useAppDispatch()
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [ postData , {isError,isLoading,isSuccess,error,data}] = usePostNoAuthMutation();
  const {theme} = useSelector((state:any)=>state.theme)
  const [focused,setFocus]  = useState<string>('')
  const [index,setIndex] = useState(1);
  const [account,setAccount] = useState('')
  const [openDD,setOpenDD] = useState<boolean>(false);
  const steps= [{title:`Step 1`},{title:`Step 2`},{title:`Step 3`},{title:`Final`}]
  
  // const [phone_otp, setPhoneOTP] = useState('')
  // const [email_otp, setEmailOTP] = useState('')

  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );

  // Function to navigate to specific page


  async function sendPhoneOTP(data:any) {
    try{
      const mobile = data.mobile
      const subdata = [{
        mobile_number :mobile,
        type:'phone_number',
        minlength:8, 
        canBeEmpty:false
      }]
      const validated = validationBuilder(subdata)
      const resp = await postData({data: validated,endpoint:'/mobile-otp/'}).unwrap()
      if (resp.isSuccess){
        const message = resp?.data?.message
         //  Create a notification
        rendermodal({
          dispatch: dispatch,
          header: "Success",
          status: "success",
          content: message,
        })
         //  Proceed to next step
         setIndex(index+1)
      } 
      else{
        throw new Error('An Error Occurred Please Try Again Later')
      }
    }
    catch(error:any){
      rendermodal({
        dispatch: dispatch,
        header: "Error",
        status: "error",
        content: error.message,
      })
    }
  }

  async function verifyOTP(data:any) {
   try{
    const otp = data.otp
    const submit = [{
      otp_code:otp,
      type:'number',
      minlength:5, 
      canBeEmpty:false
    }]
    const validated = validationBuilder(submit)
    const resp = await postData({data:validated,endpoint:'/auth/mobile-otp/verify/'}).unwrap()
    if (resp.isSuccess){
      const message = resp?.data?.message
       //  Create a notification
      rendermodal({
        dispatch: dispatch,
        header: "Success",
        status: "error",
        content: message,
      })
       //  Proceed to next step
       setIndex(index+1)
    } 
    else{
      throw new Error('Server Error')
    }
  }
  catch(error:any){
    rendermodal({
      dispatch: dispatch,
      header: "Error",
      status: "error",
      content: error.message,
    })
  }
  }

  async function registerUser(data:any){
      try {
        const response = await postData({data:data,endpoint:'/user-registration/'}).unwrap()
        if (response){
           //  Create a notification
          rendermodal({
            dispatch: dispatch,
            header: "Success",
            status: "success",
            content: 'Your Account Has Been Created Successfully',
          })
           //  Proceed to next step
          router.replace('/signin')
        } 
      } 
      catch (error:any) {
        rendermodal({
          dispatch: dispatch,
          header: "Error",
          status: "error",
          content: error.message,
        })
      }
  }

  function RegisterPhoneNumber(){
    return (
      <View style={[globalstyles.column,{paddingVertical:20}]}>
        <Text
        style={{color:theme.text,textAlign:'center'}}
        > 
          Add Your Phone Number
        </Text>
      <View style={[globalstyles.row,{width:'80%',marginVertical:30,
      gap:10,
      paddingLeft:35}]}>
  
           <View style={[
            globalstyles.columnCenter,
            {width:70,height:44,
            borderRadius:10,
            borderWidth:1,borderColor:'#888'}]}>
                <Text style={[{color:theme.text,fontWeight:'500'}]}>
                  🇰🇪 {''} +254
                </Text>
           </View>
           
           <Controller
            control={control}
            rules={{
              required: 'Phone number is required',
              minLength: { value: 8, message: 'Phone number must be at least 9 characters' },
              pattern: {
                value: /^[0-9]*$/,
                message: 'Phone number can only contain numeric characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
          <View>
          <TextInput
            keyboardType={'numeric'}
            onChangeText={onChange}
            maxLength={10}
            onBlur={()=>setFocus('')}
            onFocus={()=>setFocus('mobile')}
            style={{
              padding:5,
              borderColor: focused == 'mobile' ? "#b35900":theme.text,
              color:theme.text,
              borderBottomWidth:1,width:'80%'}}
            value={value}
            placeholderTextColor={'#888'}
            placeholder="Phone Number" 
          />
            {errors.mobile &&
      <Text style={[globalstyles.error]}>{errors.mobile ? 'Mobile number is incorrect' :''  }</Text>}
          </View>
        )}
        name="mobile"
        defaultValue=""
      />
      </View>
    
      <TouchableOpacity
          onPress={handleSubmit(sendPhoneOTP)}
          style={[ globalstyles.columnCenter,
            {
              backgroundColor: "#b35900",
              width: "80%",
              alignSelf: "center",
              height:44
            }
          ]}
        >
          <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Send OTP</Text>
      </TouchableOpacity>

     <View style={[{width:'80%',
      marginTop:20,alignSelf:'center'}]}>
      <Text
        style={{
          fontSize:10,
          lineHeight:15,
          color:theme.text,textAlign:'center'}}
        > 
        Sms with a verification code will be sent to your  handset.{'\n'}
        Please use the code to verify your identity in the next step
        </Text>
      </View>

    </View>
    )
  }

  function OTPVerification() {
    return (
     <View style={[globalstyles.column,{paddingVertical:20}]}>
      
      <Text style={{
        
        textAlign:'center',
        color:theme.text,
        textTransform:'capitalize'
      }}>
      Use the Code sent to your phone via sms
      </Text>
      
      <Controller
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (
        <TaggedInput
            onChangeText={onChange}
            keyboardType={'numeric'}
            onBlur={()=>setFocus('')}
            onFocus={()=>setFocus('otp')}
            maxLength={6}
            taggedInputContainerStyles={{
              padding:5,
              marginVertical:35,
              borderColor:focused == 'otp'?'orange':'#888'}}
            value={value}
            errorMessage={errors.otp ? errors.otp.message : ''}
            caption='OTP Code'
            placeholder="Enter Verification code"
          />
      )}
      name="otp"
      defaultValue=""
    />
      <TouchableOpacity
          onPress={()=>handleSubmit(verifyOTP)}
          style={[ globalstyles.columnCenter,
            {
              backgroundColor: "#b35900",
              width: "80%",
              alignSelf: "center",
              height:44
            }
          ]}
        >
          <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Verify OTP Code</Text>
      </TouchableOpacity>
      
      <Pressable style={{width:'80%',alignSelf:'center',marginTop:22,
       borderBottomColor:theme.text,borderBottomWidth:1
      }}>
         <Text style={{
          textAlign:'center',
          color:theme.text}}>
          Resend OTP ? I didn't receive any sms.</Text>
      </Pressable>

    </View>
    )
  }

  function ChooseAccountType(){
     const  accountOptions = [ 
      {
        title:'Job Seeker',
        value:'jobseeker'
     }, 
     {
      title:'Hiring',
      value:'recruiter'
    }]
    return (
      <View style={[globalstyles.card,{
        position:'absolute',top:70,
        right:2,
        zIndex:1,width:130,height:100,
        backgroundColor:'rgba(0,0,0,0.9)'}]}>
          {
            accountOptions.map((item,index)=>
              <Pressable 
              style={[{marginVertical:4,
                borderWidth:1,
                padding:2,
                borderColor:theme.text,
                borderRadius:10},
                item.value === account &&
                {
                  backgroundColor:theme.postBackground}
              ]}
              onPress={()=>{
                setOpenDD(!openDD);
                setAccount(item.value)}
                } key={index}>
                <Text 
                style={{
                  textAlign:'center',
                  fontWeight:'500',
                  color:theme.text}}>
                  {item.title}
                  </Text>
              </Pressable>
            )
          }
      </View>
    )
  }

  function PersonalInformation(){
    return(
      <View style={[globalstyles.column]}>
          
           <View style={{width:'80%',marginBottom:20,alignSelf:'center'}}>
           <Text style={{
            color:theme.text,
            textTransform:'capitalize'
            }}>
              Personal Information
          </Text> 
           </View>
         
          <Pressable 
          onPress={()=>setOpenDD(!openDD)}
          style={[
            globalstyles.row,
            {width:'80%',marginBottom:20,
            gap:10,
            alignSelf:'center'}]}>
              <Text style={{
                color:theme.text,
                textTransform:'capitalize'
                }}>
                  Are You Hiring or Looking For A Job?    
              </Text> 
              <AntDesign 
              name= { openDD ? "caretup": "caretdown"} 
              size={18}
              color={'green'} 
              />
          </Pressable>

          {openDD &&
          <ChooseAccountType/>
          }


          <Controller
          control={control}
          rules={{ 
          required: 'Your name is required',
          minLength: { value: 5, message: 'Your name must be at least 5 characters' },
          pattern: {
            value: /^[a-zA-Z0-9_]*$/,
            message: 'Username can only contain letters, numbers, and underscores',
          },

          }}
          render={({ field: { onChange, value } }) => (
          <TaggedInput
            onChangeText={onChange}
            onBlur={()=>setFocus('')}
            onFocus={()=>setFocus('name')}
            maxLength={50}
            taggedInputContainerStyles={{
              padding:5,borderColor:focused == 'name'?'orange':'#888'}}
            value={value}
            secureTextEntry
            caption='Your Name'
            placeholder="Enter Your Full Name"
            errorMessage = { errors.name ? errors?.name?.message : ''}
          />
        )}
        name="name"
        defaultValue=""
      />
     

        <TouchableOpacity
          // onPress={sendPhoneOTP(123)}
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
          <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Next</Text>
        </TouchableOpacity>

            <View style={[{width:'80%',alignSelf:'center'}]}>
          <Text
            style={{
              fontSize:10,
              lineHeight:15,
              color:theme.text}}
            > 
            ** All Fields Are Required Please Fill
            </Text>
          </View>
      </View>
    )
  }

  function  SecurityInformation(){
    return(
      <View style={[globalstyles.column]}>

            <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TaggedInput
                onChangeText={onChange}
                onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('pass')}
                taggedInputContainerStyles={{
                  padding:5,
                  borderColor:focused == 'pass'?'orange':'#888'}}
                value={value}
                secureTextEntry= {true}
                caption='Password'
                errorMessage = { errors.password ? errors?.password?.message : ''}
                placeholder="Enter password"
              />
            )}
            name="password"
            defaultValue=""
          />

          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TaggedInput
                onChangeText={onChange}
                onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('reppass')}
                taggedInputContainerStyles={{
                  padding:5,
                borderColor:focused == 'reppass'?'orange':'#888'
                }}
                value={value}
                secureTextEntry={true}
                caption='Repeat Password'
                errorMessage = { errors.repeatpassword  ? errors?.repeatpassword?.message : ''}
                placeholder="Repeat password"
              />
            )}
            name="repeatpassword"
            defaultValue=""
          />

        <TouchableOpacity
          onPress={handleSubmit(registerUser)}
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
          <Text 
          style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Create Account</Text>
        </TouchableOpacity>

      </View> 
    )
  }

  function OrderScreens(index:number){
    if(index === 1){
      return <RegisterPhoneNumber/>
    }
    else if (index === 2){
      return <OTPVerification/>
    }
    else if (index === 3){
     return  <PersonalInformation/>
    }
    else{
      return <SecurityInformation/>
    }
  }

  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
      <View style={[globalstyles.column,{flexGrow:1}]}>
        <View style={{width:'100%',height:'40%',
          overflow:'hidden',
          backgroundColor:'rgba(1,0,9,0.2)'}}>
           <Image style={{width:'100%'
           ,resizeMode:'center', 
            height:'100%'
            }} source={logo}/>
        </View>

        <View style={[globalstyles.rowEven,{marginVertical:8}]}>
         
         {steps.map((step:any,i:number)=>
          <View 
          key={i}
          style={[globalstyles.column]}>
          <Text style={{color:
             i+1 <= index ? '#0080ff':
            theme.text,fontWeight:'500'}}>{step.title}</Text>
          <AntDesign name= {  i+1 <= index ? "rightcircle":"rightcircleo" }
          size={20} color={
            i+1 <= index ? '#0080ff':
            theme.text} />
        </View>
        )}
        
        </View>
        
        <View style={[globalstyles.card,
          {backgroundColor:theme.card,
            maxHeight:'45%'
          }]}>
           {OrderScreens(index)}
        </View>
     
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});

export default SignUpScreen;
