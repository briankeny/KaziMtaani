import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { usePostFormDataMutation } from '@/kazisrc/store/services/authApi';
import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { RenderTaggedInput } from '@/kazisrc/components/Inputs';
import { clearModal } from '@/kazisrc/store/slices/modalSlice';
import Toast from '@/kazisrc/components/Toast';

const JobPostCreateScreen = () => {
  const dispatch = useAppDispatch();
  const [postData, { isLoading, isSuccess, error, isError }] = usePostFormDataMutation();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  // Form state variables
  const [errors,setErrors] = useState <any>({})
  const [focused,setFocus]  = useState<string>('')
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [salaryRange, setSalaryRange] = useState<string>('');

  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  
  //Toggle Modal

  function closeModal(){
    dispatch(clearModal())
  }
  

  const handleSubmit = async () => {
    
  };

  return (
    <SafeAreaView style={[globalstyles.safeArea, { backgroundColor: theme.background }]}>
     <ScrollView>
      <View style={[globalstyles.card,globalstyles.column,{backgroundColor:theme.card}]}>
        <RenderTaggedInput
        maxLength={5}
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
        />
        <RenderTaggedInput
        maxLength={5}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('desc')}
          taggedInputContainerStyles={{
            padding:5,
          borderColor:focused == 'desc'?'orange':'#888'
          }}
          value={description}
          onChangeText={(val)=>setDescription(val)}
          placeholder="Job Description"
          caption="Description"
          captionContainerStyles={{ backgroundColor: theme.card }}
        />
        <RenderTaggedInput
        maxLength={5}
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
        />
        <RenderTaggedInput
        maxLength={5}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('emptype')}
          taggedInputContainerStyles={{
            padding:5,
          borderColor:focused == 'emptype'?'orange':'#888'
          }}
          value={employmentType}
          onChangeText={(val)=>setEmploymentType(val)}
          placeholder="part_time"
          caption="Employment Type"
          captionContainerStyles={{ backgroundColor: theme.card }}
        />

        <RenderTaggedInput
        maxLength={5}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('reppass')}
          taggedInputContainerStyles={{
            padding:5,
          borderColor:focused == 'reppass'?'orange':'#888'
          }}
          value={experienceLevel}
          onChangeText={setExperienceLevel}
          placeholder="Experience Level"
          caption="Experience Level"
          captionContainerStyles={{ backgroundColor: theme.card }}
        />
       
        <RenderTaggedInput
          maxLength={25}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('reppass')}
          taggedInputContainerStyles={{
            padding:5,
          borderColor:focused == 'reppass'?'orange':'#888'
          }}
          value={salaryRange}
          onChangeText={(val)=>setSalaryRange(val)}
          placeholder="ex Ksh 2000-3000 per/day"
          caption="Salary"
          captionContainerStyles={{ backgroundColor: theme.card }}
        />
      
      <TouchableOpacity
          onPress={handleSubmit}
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
          style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Create Post</Text>
        </TouchableOpacity>
      </View>
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