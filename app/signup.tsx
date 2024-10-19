import React, { useEffect, useState } from 'react';
import { View, TextInput,Text, StyleSheet,Image, SafeAreaView,TouchableOpacity, Pressable } from 'react-native';
import { TaggedInput } from '@/components/Inputs';
import { useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { globalstyles } from '@/styles/styles';
import { AntDesign } from '@expo/vector-icons';
import { usePostNoAuthMutation } from '@/store/services/authApi';
import { checkStrForPurelyNumbers, validationBuilder } from '@/utils/validator';
import { clearModal, rendermodal } from '@/store/slices/modalSlice';
import { router } from 'expo-router';
import { logo } from '@/images/images';
import Toast from '@/components/Toast';

const SignUpScreen = () => {
  const dispatch = useAppDispatch()
  const [ postData , {isError,isLoading,isSuccess,error,data}] = usePostNoAuthMutation();
  const {theme, isNightMode} = useSelector((state:any)=>state.theme)
 
  const [user,setUser] = useState <any>({
     full_name : '',
     mobile_number:'',
     otp:'',
     account_type: 'jobseeker',
     password:'',
     repeat_password:''
  }) 
  const [errors,setErrors] = useState <any>({})

  const rules = [
    {
      full_name:user.full_name,
      minlength:6, 
      type:'string'
    },
    
    {
      mobile_number: user.mobile_number,
      minlength:9,
      type:'password'
      },
      {
        otp:user.otp,
        minlength:5,
        type:"number"
       },
       {
        account_type: user.account_type,
        minlength:4,
        type:'string'
      },
      {
        password: user.password,
        minlength:9,
        type:'password'
      },
      {
        repeat_password: user.repeat_password,
        minlength:9,
        type:'password'
      }
  ]

  const [focused,setFocus]  = useState<string>('')
  const [index,setIndex] = useState<number>(1);
  const [openDD,setOpenDD] = useState<boolean>(false);
  const steps= [{title:`Step 1`},{title:`Step 2`},{title:`Step 3`},{title:`Final`}]
  
  function handleNumeric(val:string,setterFunc:any){
    const clean = checkStrForPurelyNumbers(val)
      setterFunc(clean)
  }
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  
  // Toggle Modal
  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  async function sendPhoneOTP() {
    if (!isLoading){
    try{
      const data = [rules[0]]
      const validated = validationBuilder(data) 
      const resp = await postData({data:validated,endpoint:'/mobile-otp/'}).unwrap()
      if (resp){
         //  Create a notification
        rendermodal({
          dispatch: dispatch,
          header: "Success",
          status: "success",
          content: `OTP verification code has been sent to +254${user.mobile_number}!`,
        })
         //  Proceed to next step
         setIndex(index+1)
      } 
      else{
        throw new Error('An Error Occurred Please Try Again Later')
      }
    }
    catch(error:any){
      setErrors(error)
    }
    }
  }
  
  function checkPersonalDetails(data:any) {
     try{
      const validated = validationBuilder(rules)
      if(validated){
        setIndex(index+1)
      }
     }
     catch(err:any){
      setErrors(err)
     }
  }

  async function verifyOTP() {
  if (!isLoading){
    try{
    const data  = [rules[0], rules[1]]
    const validated = validationBuilder(data)
    const resp = await postData({data:validated,endpoint:'/verify-mobile-otp/'}).unwrap()
    if (resp){
      rendermodal({
        dispatch: dispatch,
        header: "Success",
        status: "success",
        content: "OTP verification was successful!",
      })
       //  Proceed to next step
       setIndex(index+1)
    } 
  }
  catch(error:any){
    setErrors(error)
  }}
  }

  async function registerUser(){
    if (!isLoading){
      try {
        const validated = validationBuilder(rules)
        const response = await postData({data:validated,endpoint:'/user-registration/'}).unwrap()
        if (response){
           //  Create a notification
          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: 'Your Account Has Been Created Successfully',
          })
          
          // Function to navigate to sign in page
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
            onChangeText={(val)=>setUser(user.mobile_number = val)}
            maxLength={11}
            onBlur={()=>setFocus('')}
            onFocus={()=>setFocus('mobile')}
            style={{
              padding:5,
              borderColor: focused == 'mobile' ? "#b35900":theme.text,
              color:theme.text,
              borderBottomWidth:1,
              width:190}}
            value={user.mobile_number}
            placeholderTextColor={'#888'}
            placeholder="Phone Number" 
          />
            {errors.mobile_number &&
            <Text style={[globalstyles.error]}>{errors.mobile_number ? 'Mobile number is incorrect' :''  }</Text>}
        </View>
      
      </View>
    
      <TouchableOpacity
          onPress={sendPhoneOTP}
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
    
        <TaggedInput
            onChangeText={(val)=>handleNumeric(val,setUser(user.otp))}
            keyboardType={'numeric'}
            onBlur={()=>setFocus('')}
            onFocus={()=>setFocus('otp')}
            maxLength={6}
            taggedInputContainerStyles={{
              padding:5,
              marginVertical:35,
              borderColor:focused == 'otp'?'orange':'#888'}}
            value={user.otp}
            errorMessage={errors.otp ? errors.otp.message : ''}
            caption='OTP Code'
            placeholder="Enter Verification code"
          />
   
      <TouchableOpacity
          onPress={verifyOTP}
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
        backgroundColor: theme.card}]}>
          {
            accountOptions.map((item,index)=>
              <Pressable 
              style={[{marginVertical:4,
                borderWidth: 1,
                padding:2,
                borderColor: theme.text,
                borderRadius:10},
                item.value === user.account &&
                {
                  backgroundColor: 'green'}
              ]}
              onPress={()=>{
                setOpenDD(!openDD);
                setUser( user.account_type = item.value)}
                } key={index}>
                <Text 
                style={[{
                  textAlign:'center',
                  fontWeight:'500',
                },item.value === user.account_type &&
                {
                  color: '#fff'}
                ]}>
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

          <TaggedInput
            onChangeText={(val)=> setUser(user.full_name = val)}
            onBlur={()=>setFocus('')}
            onFocus={()=>setFocus('name')}
            maxLength={50}
            taggedInputContainerStyles={{
              padding:5,borderColor:focused == 'name'?'orange':'#888'}}
            value={user.full_name}
            caption= {`Your ${user.account=='recruiter' ? 'Individual or Company':''} Name`}
            placeholder="Enter Full Name"
            errorMessage = { errors.full_name ? 'Full Name is required. Minimum of 5 characters' : ''}
          />
     
        <TouchableOpacity
          onPress={checkPersonalDetails}
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
              <TaggedInput
                onChangeText={(val)=>setUser(user.password = val)}
                onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('pass')}
                taggedInputContainerStyles={{
                  padding:5,
                  borderColor:focused == 'pass'?'orange':'#888'}}
                value={user.password}
                secureTextEntry= {true}
                caption='Password'
                errorMessage = { errors.password ? errors?.password : ''}
                placeholder="Enter password"
              />
            

              <TaggedInput
                onChangeText={(val)=>setUser(user.repeat_password = val)}
                onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('reppass')}
                taggedInputContainerStyles={{
                  padding:5,
                borderColor:focused == 'reppass'?'orange':'#888'
                }}
                value={user.repeat_password}
                secureTextEntry={true}
                caption='Repeat Password'
                errorMessage = { errors.repeat_password  ? errors?.repeat_password : ''}
                placeholder="Repeat password"
              />

        <TouchableOpacity
          onPress={registerUser}
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

  useEffect(() => {
    if (isError) {
      console.log('The error: ' + JSON.stringify(error, null, 2));
    }
  }, [isError]);
  

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

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});

export default SignUpScreen;