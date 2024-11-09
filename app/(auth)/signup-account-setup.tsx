import { TaggedInput } from '@/kazisrc/components/Inputs';
import RenderPicker from '@/kazisrc/components/RenderPicker';
import Toast from '@/kazisrc/components/Toast';
import { usePostNoAuthMutation } from '@/kazisrc/store/services/authApi';
import { setAuthScreenIndex } from '@/kazisrc/store/slices/authSlice';
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { generateRandomUserName } from '@/kazisrc/utils/utils';
import { validationBuilder } from '@/kazisrc/utils/validator';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity,Text, Pressable, ScrollView } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

const SignUpScreen = () => {
  const dispatch = useAppDispatch()
  const [ postData , {isError,isLoading,isSuccess,error,data}] = usePostNoAuthMutation();
  
  type ParamTypes = {
    mobile: string ;
    otp: string ;
  };

  const params:ParamTypes = useLocalSearchParams();
  const {theme, isNightMode} = useSelector((state:any)=>state.theme)
  const [full_name, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('')
  const [account_type, setAccountType] = useState<string>('');
  const [industry,setIndustry] = useState<string>('')
  const [password, setPassword] = useState<string>('');
  const [repeat_password, setRepeatPassword] = useState<string>('');
  const [prevData, setPrevData ] = useState<any>([])
  const [errors,setErrors] = useState <any>({})
  const [focused,setFocus]  = useState<string>('')
  const [openDD,setOpenDD] = useState<boolean>(false);
  
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  
  //Toggle Modal

  function closeModal(){
    dispatch(clearModal())
  }
  
  async function registerUser(){
    if (!isLoading){
      try {
        const {mobile ,otp} = params 
        
        const rules =[    {
          full_name:full_name,
          minlength:6, 
          type:'string'
        },
        {
          industry: industry,
          minlength:3, 
          type:'string'
        },
        {
          email:email,
          minlength:10, 
          type:'email',
          canBeEmpty:true
        },
      
        {
          password: password,
          minlength:9,
          type:'password'
        },
        {
          repeat_password: repeat_password,
          minlength:9,
          type:'password'
        }
      ]

      rules.push(JSON.parse(mobile))
      rules.push(JSON.parse(otp))
    
       if (repeat_password != password){
        const err = {
          repeat_password:'Passwords Must Match'
        }
        throw err
       }
        const validated:any = validationBuilder(rules)
        const username = generateRandomUserName(full_name)
        validated['username'] = username
        account_type ? validated['account_type'] = account_type : validated['account_type'] = 'jobseeker'
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
          router.replace('/(auth)/')
        } 
      } 
      catch (error:any) {
   
        setErrors(error)
      }
    }
  }


  useEffect(()=>{
    if(isError){
        rendermodal({
            dispatch: dispatch,
            header: "Oops!",
            status: "error",
            content: "Please try again later",
          })

        }
        
    },[isError])

    useEffect(()=>{
      dispatch(setAuthScreenIndex(3))
    },[])

  
  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
    <ScrollView>
      <View style={[globalstyles.column,{flexGrow:1, backgroundColor:theme.card}]}>
          
          <View style={{width:'80%',marginVertical:20,alignSelf:'center'}}>
          <Text style={{
           color:theme.text,
           textAlign:'center',
           textTransform:'capitalize'
           }}>
             ** Personal Information
         </Text> 
          </View>
        

          {RenderPicker({
            theme:theme,
            label:"label",
            value:'label',
            caption:'Select Account Type',
            list:[
              {label:'recruiter'},
              {label: 'jobseeker'},
            ],
            selectedValue: account_type, 
            pickerAction:(val:any) => setAccountType(val)})}

         <TaggedInput
           onChangeText={(val:any)=> setFullName(val)}
           onBlur={()=>setFocus('')}
           onFocus={()=>setFocus('name')}
           maxLength={50}
           taggedInputContainerStyles={{
             padding:5,borderColor:focused == 'name'?'orange':'#888'}}
           value={full_name}
           caption= {`Your ${account_type =='recruiter' ? 'Individual or Company':''} Name`}
           placeholder="Enter Full Name"
           errorMessage = { errors.full_name ? 'Full Name is required. Minimum of 5 characters' : ''}
         />

        <TaggedInput
           onChangeText={(val:any)=> setIndustry(val)}
           onBlur={()=>setFocus('')}
           onFocus={()=>setFocus('ind')}
           maxLength={50}
           taggedInputContainerStyles={{
             padding:5,borderColor:focused == 'ind'?'orange':'#888'}}
           value={industry}
           caption= {'Profession or Industry'}
           placeholder="ex. Plumber, electrician, cleaner"
           errorMessage = { errors.industry ? errors.industry : ''}
         />
         
         <TaggedInput
           onChangeText={(val:any)=> setEmail(val)}
           onBlur={()=>setFocus('')}
           onFocus={()=>setFocus('email')}
           maxLength={50}
           taggedInputContainerStyles={{
             padding:5,borderColor:focused == 'email'?'orange':'#888'}}
           value={email}
           caption= {'Email Adress'}
           placeholder="ex. abc@xyz.com"
           errorMessage = { errors.email ? 'Email address is required!' : ''}
         />
     
              <TaggedInput
                onChangeText={(val:any)=>setPassword(val)}
                onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('pass')}
                taggedInputContainerStyles={{
                  padding:5,
                  borderColor:focused == 'pass'?'orange':'#888'}}
                value={password}
                secureTextEntry= {true}
                caption='Password'
                errorMessage = { errors.password ? errors?.password : ''}
                placeholder="Enter password"
              />
            

              <TaggedInput
                onChangeText={(val:any)=>setRepeatPassword(val)}
                onBlur={()=>setFocus('')}
                onFocus={()=>setFocus('reppass')}
                taggedInputContainerStyles={{
                  padding:5,
                borderColor:focused == 'reppass'?'orange':'#888'
                }}
                value={repeat_password}
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

        <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
      </View>
     </ScrollView>
    </SafeAreaView>
  );
};


export default SignUpScreen;