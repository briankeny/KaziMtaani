import { CustomUserAvatar } from "@/kazisrc/components/Headers";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { setJobApplications } from "@/kazisrc/store/slices/jobsSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateDifferenceWithUnit, dateFormater } from "@/kazisrc/utils/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";

export default function JobApplicationsScreen() {
  const dispatch = useAppDispatch();
  const swipeableRowRef = useRef<any>(null);
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const { jobapplications } = useSelector((state: any) => state.messages);
  const [getData, { data, isLoading, isError, error, isSuccess }] =
    useGetResourceMutation();

  async function fetchJobAps() {
    try {
      const resp = await getData({ endpoint: "/job-applications/" }).unwrap();
      if (resp) {
        const data = resp.results ? resp.results : [];
        const arr = [...jobapplications, ...data];
        const cleaned = [...new Set(arr)];

        dispatch(setJobApplications(cleaned));
      }
    } catch (error: any) {}
  }

  useEffect(() => {
    fetchJobAps();
  }, []);

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      {jobapplications.length > 0 ?
      <FlatList
        keyExtractor={(item) => item.advert_id.toString()}
        data={jobapplications}
        renderItem={({ item, index }: { item: any; index: number }) => (
          <JobApplicationCard item={item} theme={theme} key={index} />
        )}
      />
    : 
     <View style={[globalstyles.columnCenter,{height:'100%'}]}>
        <Text style={{color:theme.text,textAlign:'center'}}>Found 0 job applications</Text>
     </View>
    }
    </SafeAreaView>
  );
}

export function JobApplicationCard({ item, theme }: any) {
  const {dat,time} = dateFormater(item.date);
  return (
    <View
      style={[
        globalstyles.card,
        {
          backgroundColor: theme.card    
        },
      ]}
    >
      <View style={[globalstyles.rowWide]}>

        <View style={{
            height:60,
            width:60,
            borderRadius:30
          }}>
          
          { item?.jobpost?.recruiter?.profile_picture ?
            <Image style={{height:60, width:60,borderRadius:30}} source={{uri:item.jobpost.recruiter.profile_picture}}/>
            :
            <CustomUserAvatar
            name={item?.jobpost?.recruiter?.profile_picture?.full_name}
            />
          }
         
        </View>

        <Text numberOfLines={1}
        ellipsizeMode="tail"
        style={[{ color: theme.text, fontWeight: "500" }]}>
          {item.title}
        </Text>

        <Text style={[{ color: theme.text, fontSize: 11 }]}> {dat} {time}</Text>
        
      </View>
    </View>
  );
}
