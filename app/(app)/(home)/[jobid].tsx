import { useGetResourceMutation, usePostResourceMutation } from '@/store/services/authApi';
import { useAppDispatch } from '@/store/store';
import { globalstyles } from '@/styles/styles';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View,Text, TouchableOpacity} from 'react-native'
import { useSelector } from 'react-redux';


export default function JobProfile() {
  const {jobid} = useLocalSearchParams()
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const [jobad , setJobAd] = useState<any>({})
  const {authError} = useSelector((state: any) => state.auth);
  const [getUserData, {data, isLoading, isError, error, isSuccess }] = useGetResourceMutation();
  const [postData, {}] = usePostResourceMutation()

  async function fetchJobData() {
    try{
       await getUserData({endpoint:`/jobadverts/${jobid}/`})
    }
    catch(error:any){

    }
  }

  async function applyJobAdv() {
    try{
      const data = {user_id:1,job_id:jobad.advert_id}
      const resp = await postData({data:data,endpoint:`/jobs/`})
      if(resp){

      }
    }
    catch(error:any){

    }
  }

  useEffect(()=>{
    fetchJobData()
  },[])

  useEffect(()=>{
    isSuccess && setJobAd(data)
  },[data,isSuccess])

  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
      <View>
      
          <View style={[globalstyles.column]}>
            <Text style={[{color:theme.text}]}>{jobad.description}</Text>
          </View>

          <View style={{position:'absolute',bottom:0}}>
            <TouchableOpacity onPress={applyJobAdv}>
                <Text style={{color:theme.text}}>Apply</Text>
            </TouchableOpacity>
          </View>
      
      </View>
    </SafeAreaView>
  )
}