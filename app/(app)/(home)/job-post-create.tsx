import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text,  ScrollView, TouchableOpacity ,Image, Pressable} from 'react-native';
import { useGetResourceMutation, usePostFormDataMutation } from '@/kazisrc/store/services/authApi';
import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { RenderTaggedInput } from '@/kazisrc/components/Inputs';
import { clearModal } from '@/kazisrc/store/slices/modalSlice';
import Toast from '@/kazisrc/components/Toast';
import RenderPicker from '@/kazisrc/components/RenderPicker';
import { validationBuilder } from '@/kazisrc/utils/validator';
import { formatDate, imageAndBodyConstructor, pickImage, randomKeyGenerator, removeSpace} from '@/kazisrc/utils/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { RenderButtonRow } from '@/kazisrc/components/Buttons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from 'expo-router';

const JobPostCreateScreen = () => {
  const dispatch = useAppDispatch();
  const [getData, {data}] = useGetResourceMutation();
  const [postData, { isLoading, isSuccess, error, isError }] = usePostFormDataMutation();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const {userData} = useSelector((state:any)=>state.auth)
  // Form state variables
  const [errors,setErrors] = useState <any>({})
  const [focused,setFocus]  = useState<string>('')

  const [title, setTitle] = useState<string>('');
  
  const  [category , setCategory] = useState<any>();
  const  [categories ,setCategories] = useState<any>([]);

  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [employment_type, setEmployment_type] = useState<string | any>('');
  const [experience_level, setExperience_level] = useState<string | any>('');
  const [salary_range, setSalary_range] = useState<string>('');

  const [openDate,setOpenDate] = useState<any>(false)
  const [deadline_date, setDeadlineDate] = useState <any>(new Date());

  const [image, setImage] = useState<any>(null);
  const [newImage, setNewImage] = useState(false);
  const [imageType, setImageType] = useState("png");


  const handleMapPress = () => {
    // const { latitude, longitude } = event.nativeEvent.coordinate;
    // console.log('Choose location',latitude,longitude)
    // setLocation({ latitude, longitude });
    };


    async function fetchCategories() {
      try{
        const resp = await getData({endpoint:'/jobs/'}).unwrap()
        if(resp){
          resp.results && setCategories(resp.results)
        }
      }
      catch(error:any){

      }
    }

    async function openImagePicker() {
      try {
        const result = await pickImage();
        if (!result.canceled) {
          const img = result?.assets[0]?.uri ? result.assets[0].uri : ''
          const imgtype = img ?  img.split('.')[-1] : ''
          img &&  setNewImage(true);
          img && setImage(img);
          imgtype && setImageType(imageType)
        }
      } catch (error: any) {}
    }


  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  
  // Clear Image
  function clearImage(){
    setNewImage(false)
    setImage(null)
    setImageType('')
  }

  //Toggle Modal
  function closeModal(){
    dispatch(clearModal())
  }
  

  const handleSubmit = async () => {
    if(!isLoading){
      try{
        const rules = [
          {
            title : title,
            type:'string',
            minLength:8
          },
          {
            description : description,
            type:'string',
            minLength:8
          },
          {
            location:location,
            type:'string',
            minLength:8
          },
          {
            employment_type :employment_type,
            type:'string',
            minLength:8
          },
          {
            experience_level :experience_level,
            type:'string',
            minLength:8
          },   
          {
            salary_range :salary_range,
            type:'string',
            minLength:8
          },{
            deadline_date:formatDate(deadline_date),
            type:'string',
            minlength:5,
            canBeEmpty:true
          }
        ]
        
        const validated = validationBuilder(rules)
        const images = []
        
        if(newImage){
              let img ={   
              uri: image,
              type: `image/${imageType}`,
              name: `${removeSpace(userData.full_name)}${randomKeyGenerator()}.${imageType}`
            }
            images.push(img)
          }
        const dataToSubmit =imageAndBodyConstructor({content:validated,images:images,uploadname:["job_picture"]});
        const resp = await postData({enpoint:'/job-posts/' , data:dataToSubmit}).unwrap()
        if(resp){
            
        }
      }
      catch(error:any){
        setErrors(error)
      }
    }
  };

  useEffect(()=>{
    fetchCategories()
  },[])

  return (
    <SafeAreaView style={[globalstyles.safeArea, { backgroundColor: theme.background }]}>
     <ScrollView>

     <TouchableOpacity onPress={openImagePicker}
            style={[
              {height:300,
                width:'100%',
                overflow:'hidden',
                backgroundColor:'rgba(0,0,0,0.05)'}]}
          >
            {image ?
              <Image source={{ uri: image }} style={{width:'100%',height:'100%',resizeMode:'cover'}} />
            :
              <MaterialIcons   style={{ alignSelf: "center" ,paddingTop:40}}
               name="add-a-photo" size={100} color='rgb(255,160, 0)' />
            }

            {!image &&
              <Text style={[{color:'#777',textAlign:'center',
              lineHeight:24,
              fontSize:18,padding:30}]}>
                **optional {'\n'} Upload a picture of the job  ex. Logo, task, broken item ,work site etc
              </Text>
            }
      </TouchableOpacity>
      
      { newImage && RenderButtonRow({
              buttonStyles:[globalstyles.row,{alignSelf:'center',
                borderWidth:1,
                borderColor:'red',borderRadius:20,marginVertical:5,padding:10}],
              action: clearImage,
              button_text: `Remove Image`,
              Icon:MaterialIcons,
              buttonTextStyles:[{color:theme.text,fontSize:16}],
              icon_name:"delete",
              icon_color:"red"
        })}
       

      <View style={[globalstyles.column,{backgroundColor:theme.card,
        borderRadius:20,paddingVertical:10,marginVertical:10,elevation:5}]}>

        <RenderTaggedInput
        maxLength={50}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('ttl')}
          taggedInputContainerStyles={{
            padding:5,
          borderColor:focused == 'ttl'?'orange':'#888'
          }}
          value={title}
          onChangeText={(val)=>setTitle(val)}
          placeholder="Job Title"
          caption="Title"
          captionContainerStyles={{ backgroundColor: theme.card }}
          errorMessage={errors.title ? errors.title : ''}
        />
        
        {RenderPicker({
            theme:theme,
            label:"job_name",
            value:'job_name',
            caption:'Select Job Category',
            list:categories,
            selectedValue: category, 
            pickerAction:(val:any) => setCategory(val)})}

        <RenderTaggedInput
        maxLength={200}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('desc')}
          taggedInputContainerStyles={[globalstyles.columnCenter,{
            padding:5,minHeight:80,
          borderColor:focused == 'desc'?'orange':'#888'
          }]}
          taggedInputStyles={{textAlign:'center'}}
          value={description}
          onChangeText={(val)=>setDescription(val)}
          placeholder="Write a  brief description about the job here here ..."
          caption="Job Description"
          captionContainerStyles={{ backgroundColor: theme.card }}
          errorMessage={errors.description ? errors.description : ''}
        />
        
        <RenderTaggedInput
        maxLength={50}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('loc')}
          taggedInputContainerStyles={{
            padding:5,
          borderColor:focused == 'loc'?'orange':'#888'
          }}
          value={location}
          onChangeText={(val)=>setLocation(val)}
          placeholder="ex Kitengela, Kajiado"
          caption="Location"
          captionContainerStyles={{ backgroundColor: theme.card }}
          errorMessage={errors.location ? errors.location : ''}
        />
        
        {RenderPicker({
            theme:theme,
            label:"label",
            value:'label',
            caption:'Select Employment Type',
            list:[
              {label:'Full time'},
              {label: 'Part time'},
              {label:'Contract'},
              {label:'One Time'}
            ],
            selectedValue: employment_type, 
            pickerAction:(val:any) => setEmployment_type(val)})}

          
          {RenderPicker({
            theme:theme,
            label:"label",
            value:'label',
            caption:'Select Required Experience',
            list:[ 
              {label:'Entry Level'},
              {label: 'Mid Level'},
              {label:'Senior'}
            ],
            selectedValue: experience_level, 
            pickerAction:(val:any) => setExperience_level(val)})}
       
       
        <RenderTaggedInput
          maxLength={25}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('sal')}
          taggedInputContainerStyles={{
            padding:5,
          borderColor:focused == 'sal'?'orange':'#888'
          }}
          value={salary_range}
          onChangeText={(val)=>setSalary_range(val)}
          placeholder="ex Ksh 2000-3000 per/day"
          caption="Salary"
          captionContainerStyles={{ backgroundColor: theme.card }}
          errorMessage={errors.salary_range ? errors.salary_range : '' }
        />
        
        {RenderButtonRow({
              buttonStyles:[globalstyles.row,{alignSelf:'center',
                borderWidth:1,borderColor:'green',
                padding:20,marginVertical:10,gap:10}],
              action:() => setOpenDate(!openDate),
              button_text: `Deadline date ${deadline_date? formatDate(deadline_date):''}`,
              Icon:MaterialIcons,
              buttonTextStyles:[{color:theme.text,fontSize:16,fontWeight:'600'}],
              icon_name:"date-range",
              icon_color:"green"
        })}

        {openDate && (
              <DateTimePicker
                value={deadline_date}
                mode="date"
                is24Hour={true}
                onChange={(event, date:any) => {
                  setOpenDate(false);
                    setDeadlineDate(date)
                     
                }}
              />
        )}

      </View>

      <TouchableOpacity
          onPress={handleSubmit}
          style={[ globalstyles.columnCenter,
            {
              backgroundColor: "rgb(0,105,0)",
              width: "80%",
              alignSelf: "center",
              marginVertical:12,
              height:44
            }
          ]}
        >
          <Text 
          style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Create Post</Text>
        </TouchableOpacity>

      <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobPostCreateScreen;