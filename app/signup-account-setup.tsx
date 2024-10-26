import { TaggedInput } from '@/kazisrc/components/Inputs';
import Toast from '@/kazisrc/components/Toast';
import { usePostNoAuthMutation } from '@/kazisrc/store/services/authApi';
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { generateRandomUserName } from '@/kazisrc/utils/utils';
import { validationBuilder } from '@/kazisrc/utils/validator';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity,Text, Pressable, ScrollView } from "react-native";
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
  const [account_type, setAccountType] = useState<string>('jobseeker');
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
          account_type: account_type,
          minlength:4,
          type:'string'
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
   
        setErrors(error)
      }
    }
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
                item.value === account_type &&
                {
                  backgroundColor: 'green'}
              ]}
              onPress={()=>{
                setOpenDD(!openDD);
                setAccountType(item.value)}
                } key={index}>
                <Text 
                style={[{
                  textAlign:'center',
                  fontWeight:'500',
                },item.value === account_type &&
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

  useEffect(()=>{
    if(isError){
        rendermodal({
            dispatch: dispatch,
            header: "Error!",
            status: "error",
            content: "An error occurred  while trying to register the accounts",
          })


        }
    },[isError])



  
  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
    <ScrollView>
      <View style={[globalstyles.column,{flexGrow:1}]}>
          
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