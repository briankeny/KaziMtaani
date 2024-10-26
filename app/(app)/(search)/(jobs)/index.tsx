import { logo } from "@/kazisrc/images/images";
import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { setJobPosts } from "@/kazisrc/store/slices/jobsSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateDifferenceWithUnit } from "@/kazisrc/utils/utils";
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

export function JobPostsScreen() {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { jobs } = useSelector((state: any) => state.jobs);
  const [getData, { isLoading, isError, error, isSuccess }] =
    useGetResourceMutation();

  // const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
  //   (state: any) => state.modal
  // );
  
  async function fetchJobPosts() {
    try {
      const resp: any = await getData({ endpoint: "/job-posts/" }).unwrap();
      if (resp) {
        const list = [...jobs, resp.results];
        const updt_jobs = [...new Set(list)];
        dispatch(setJobPosts(updt_jobs));
      }
    } catch (error: any) {}
  }

  useEffect(()=>{
    fetchJobPosts()
  },[])

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    > {jobs.length > 0 ?
      <FlatList
        keyExtractor={(item) => item.advert_id.toString()}
        data={jobs}
        renderItem={({ item, index }: { item: any; index: number }) => (
          <JobCard item={item} theme={theme} key={index} />
        )}
      />
     :
     <View style={[globalstyles.columnCenter]}>
        <Text style={{color:theme.text}}>0 Jobs Found</Text>
     </View>
    }
    </SafeAreaView>
  );
}

export function JobCard({ item, theme }: any) {
  const time = dateDifferenceWithUnit(item.date);
  return (
    <View
      style={[
        globalstyles.card,
        {
          backgroundColor: theme.cardBackground,
          marginTop: 1,
          borderColor: "green",
          borderWidth: 1,
        },
      ]}
    >
      <View style={[globalstyles.rowWide]}>
        <View style={[globalstyles.row, { gap: 10 }]}>
          <Image
            source={logo}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <View>
            <Text
              style={{
                fontWeight: "500",
                paddingVertical: 2,
                color: theme.text,
              }}
            >
              {item?.recruiter?.full_name}
            </Text>
            <Text style={{ color: "#888", fontSize: 10 }}>
              {item?.recruiter?.username}
            </Text>
          </View>
        </View>

        <View style={[globalstyles.column]}>
          <Text style={[{ color: theme.text, fontSize: 11 }]}>{time}</Text>
        </View>
      </View>

      <View style={[{ marginVertical: 2, padding: 10 }]}>
        <Text style={[{ color: theme.text, fontWeight: "500" }]}>
          {item.title}
        </Text>
        <Text
          numberOfLines={1}
          style={[{ color: theme.text }]}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
      </View>

      <View style={[globalstyles.rowWide]}>
        <Text style={[{ color: theme.text, fontSize: 11 }]}>2 applicants</Text>
        <TouchableOpacity
          style={[
            {
              alignSelf: "center",
              borderWidth: 1,
              borderRadius: 20,
              borderColor: "#888",
            },
          ]}
        >
          <Text
            style={[
              {
                textAlign: "center",
                color: theme.text,
                fontWeight: "500",
                paddingHorizontal: 10,
                paddingVertical: 5,
              },
            ]}
          >
            Read More
          </Text>
        </TouchableOpacity>

        <Text style={[{ color: theme.text, fontSize: 11 }]}>{time}</Text>
      </View>
    </View>
  );
}
