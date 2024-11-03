import { TaggedInput } from '@/kazisrc/components/Inputs'
import { useAppDispatch } from '@/kazisrc/store/store'
import { globalstyles } from '@/kazisrc/styles/styles'
import { formatDate } from '@/kazisrc/utils/utils'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Pressable,Text} from 'react-native'
import { useSelector } from 'react-redux'
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGetResourceMutation, usePostResourceMutation } from '@/kazisrc/store/services/authApi'
import { router, useGlobalSearchParams } from 'expo-router'
import { validationBuilder } from '@/kazisrc/utils/validator'
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice'
import Toast from '@/kazisrc/components/Toast'

export default function EditSectionScreen (){
    const {sectionid} = useGlobalSearchParams()
    const dispatch = useAppDispatch()
    const [postData, { isLoading:postLoading,isError:postError}] = usePostResourceMutation(); 
    const [getData,{isLoading: getLoading}] = useGetResourceMutation();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const {userData} = useSelector((state:any)=>state.auth)
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
        (state: any) => state.modal
      );
    const [focused ,setFocus] = useState<string>('');
    const [errors,setErros] = useState<any>({});
    // Custom Section
     const [title,setTitle] = useState<string>('')
     const [subject ,setSubject] = useState<string>('')
     const [description ,setDescription] = useState<string>('')
     const [start_date, setStartDate] = useState<any| null>(null) 
     const [end_date, setEndDate] = useState<any| null >(null)
     const [openStartDate,setOpenStartDate] = useState<boolean>(false);
     const [openEndDate ,setOpenEndDate] = useState<boolean>(false);

     function closeModal() {
        dispatch(clearModal());
        return true;
      }

    async function postNewSection() {
        if(!postLoading) {
          try{
            const rules = [
              {
                subject: subject,
                type: "string",
                minLength: 3,
                canBeEmpty:true
              },
              {
                title: title,
                type: "string",
                minLength: 3
              },
              {
                description:description,
                type:'string',
                minLength :3
              }
            ]
            
            const data:any = validationBuilder(rules)
            
            start_date !== null? data['start_date'] = formatDate(start_date) : null
            end_date !== null ?  data['end_date'] = formatDate(end_date) : null
            data['user']= userData.user_id
            const resp = await postData({data:data,endpoint:'/create-user-info/'}).unwrap()
            if (resp){
              rendermodal({
                dispatch: dispatch,
                header: "Success!",
                status: "success",
                content: "Your new info has been added!",
              })
              router.replace('/(app)/(profile)')
            }
          }
          catch(error:any){
            setErros(error)
          }
        }
    }

     async function fetchSection(id:any){
        try{
          const resp =  await getData({endpoint:`/user-info/${id}/`}).unwrap()
          if(resp){
            const data = resp?.results ? resp.results : []
            // const {title,description,subject} = data
            setDescription(description)
            setTitle(title)
            setSubject(subject)
          }
        }
        catch(error){
        }
      } 

  useEffect(()=>{
    sectionid && fetchSection(sectionid)
  },[sectionid])

  useEffect(()=>{
     if(postError)   
      rendermodal({
      dispatch: dispatch,
      header: "Error!",
      status: "error",
      content: "Oops! We could not update this section please try again later!",
    })
  },[postError])
  
  return (
    <SafeAreaView
    style={[globalstyles.safeArea, { backgroundColor: theme.background}]}
  >
   <ScrollView>
  

<View style={[globalstyles.card ,{backgroundColor:theme.card,elevation:1,marginVertical:5}]}>
  <TaggedInput
    onChangeText={(val: any) => setSubject(val)}
    onBlur={() => setFocus("")}
    onFocus={() => setFocus("subj")}
    maxLength={90}
    taggedInputContainerStyles={{
      padding: 5,
      borderColor: focused == "subj" ? "green" : "#888",
    }}
    value={subject}
    caption="Subject"
    errorMessage={errors?.subject ? errors.subject : ""}
    placeholder="Ex. Experience, Education, Achievement e.t.c"
  />

  <TaggedInput
    onChangeText={(val: any) => setTitle(val)}
    onBlur={() => setFocus("")}
    onFocus={() => setFocus("title")}
    maxLength={90}
    taggedInputContainerStyles={{
      padding: 5,
      borderColor: focused == "title" ? "green" : "#888",
    }}
    value={title}
    caption="Title"
    errorMessage={errors?.title ? errors.title : ""}
    placeholder="Ex. Senior Cook  ABC resturant, Nairobi"
  />
  
  <TaggedInput
    onChangeText={(val: any) => setDescription(val)}
    onBlur={() => setFocus("")}
    onFocus={() => setFocus("descr")}
    maxLength={200}
    taggedInputContainerStyles={[globalstyles.columnCenter,{
      padding: 5,
      minHeight:80,
      borderColor: focused == "descr" ? "green" : "#888",
    }]}
    taggedInputStyles={{textAlign:'center'}}
    value={description}
    caption="Description"
    errorMessage={errors?.description ? errors.description : ""}
    placeholder="Ex. write description here..."
  />
  
  <View style={{width:'80%',paddingHorizontal:20}}>
  <Text style={{color:theme.text}}>** Optional </Text>
  </View>
 
 
   <View style={[globalstyles.row, {alignSelf:'center',
          width:'80%',
          padding:20,marginVertical:5,gap:10}]}>
   <Text style={{color:theme.text}}>Pick a Start Date</Text>
   <Pressable 
    onPress={()=>{start_date == null && setStartDate(new Date()) ; setOpenStartDate(true)} }
    style={[globalstyles.row,{gap:10}]}>
      
        <MaterialIcons name='date-range' size={22} color={'green'} />
        <Text style={{color:'green'}}> {start_date? formatDate(start_date):''}</Text>
    </Pressable>
      
      {start_date &&
      <Pressable onPress={()=>setStartDate(null)}>
          <Entypo name="cross" size={21} color='red' />
      </Pressable>
      }
   </View>
   
   <View style={[globalstyles.row, {alignSelf:'center',
          width:'80%',
          padding:20,marginVertical:5,gap:10}]}>
   <Text style={{color:theme.text}}>Pick an End Date</Text>
   <Pressable 
    onPress={()=>{end_date == null && setEndDate(new Date()) ; setOpenEndDate(true)} }
    style={[globalstyles.row,{gap:10}]}>
      
        <MaterialIcons name='date-range' size={22} color={'orange'} />
        <Text style={{color:'green'}}> {end_date? formatDate(end_date):''}</Text>
    </Pressable>
      
      {end_date &&
      <Pressable onPress={()=>setEndDate(null)}>
          <Entypo name="cross" size={21} color='red' />
      </Pressable>
      }
   </View>
  

  {openStartDate && (
      <DateTimePicker
        value={start_date}
        mode="date"
        is24Hour={true}
        onChange={(event:any, date:any) => {
          setOpenStartDate(false);
          date ? setStartDate(date) : setStartDate(null)
             
        }}
      />
  )}

{openEndDate && (
      <DateTimePicker
        value={end_date}
        mode="date"
        is24Hour={true}
        onChange={(event:any, date:any) => {
          setOpenEndDate(false);
          date ? setEndDate(date) : setEndDate(null)
         }}
      />
)}

</View>


<Pressable 
style={{
  backgroundColor: "rgba(0,105,0,1)",
  width: "80%",
  alignSelf: "center",
  marginVertical: 12,
  height: 44,
}}
onPress={postNewSection}>
   <Text style={{color:'#fff',alignSelf:'center',paddingTop:5,
   fontFamily:'Nunito-Bold',
    fontSize:20}}>Add Section</Text>
</Pressable>


   </ScrollView>
   
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
