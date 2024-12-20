import {
  useDeleteResourceMutation,
  useGetResourceMutation,
  usePostResourceMutation,
} from "@/kazisrc/store/services/authApi";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { validationBuilder } from "@/kazisrc/utils/validator";
import { Entypo, AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

export default function SkillEditScreen() {
  const dispatch = useAppDispatch();
  const [postData, { isLoading: postLoading }] = usePostResourceMutation();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { userData} = useSelector((state: any) => state.auth);
  const [getData, { isLoading: getLoading }] = useGetResourceMutation({
    fixedCacheKey: "User_Skills",
  });
  const [delData, { isLoading: delLoading }] = useDeleteResourceMutation();
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const [focused, setFocus] = useState<string>("");
  // Skills Section
  const [skill_name, setSkillName] = useState<string>("");
  const [skills, setProfSkills] = useState<any | Array<string | any>>([]);
  const [userSkills,setUserSkills] = useState<any>([])

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  async function fetchUserProfessionSkills() {
    try {
      const resp = await getData({
        endpoint: `/jobs/?searchTerm=job_name&search=${userData.industry}`,
      }).unwrap();
    
      if (resp) {
        const data = resp?.results ? resp.results : [];
        if (data && data.length > 0) {
          data.map((item: any) => {
            const profskills: any = item["job_skills"];
            if(profskills){
            const arr = [...skills, ...profskills]
            const uniqueArray = [...new Set(arr)];
            setProfSkills(uniqueArray)
            }
          });
        }
      }
    } catch (error) {}
  }

  async function fetchUserSkills() {
    try {
      const resp = await getData({
        endpoint: `/user-skills/?search=${userData.user_id}`,
      }).unwrap();
      if (resp) {
        const data = resp?.results ? resp.results : [];
        setUserSkills(data);
      }
    } catch (error) {}
  }

  async function deleteSkill(id: any) {
    if (!delLoading) {
      try {
        await delData({ endpoint: `/user-skill/${id}/` });
        rendermodal({
          dispatch: dispatch,
          header: "Success!",
          status: "success",
          content: "Skill has been removed and updated!",
        });
        fetchUserSkills();
      } catch (error: any) {
        rendermodal({
          dispatch: dispatch,
          header: "Error!",
          status: "error",
          content: "Oops! We could not delete this section!",
        });
      }
    }
  }

  async function postNewSkill() {
    if (!postLoading) {
      try {
        const rules = [
          {
            skill_name: skill_name,
            type: "string",
            minLength: 2,
          },
        ];

        const validated: any = validationBuilder(rules);
        validated["user"] = userData.user_id;
        const resp = await postData({
          endpoint: "/user-skills/",
          data: validated,
        }).unwrap();
        if (resp) {
          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "A New skill has been added!",
          });
          setSkillName("");
          fetchUserSkills();
        }
      } catch (error: any) {
        rendermodal({
          dispatch: dispatch,
          header: "Oops!",
          status: "warning",
          content:
            "We could not add skill please ensure it is not empty or it does not exist in your collection already!",
        });
      }
    }
  }

  useEffect(() => {
    fetchUserProfessionSkills();
  }, []);

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView>
        <View style={[globalstyles.card, { backgroundColor: theme.card }]}>
          <View style={[globalstyles.column, { paddingVertical: 20 }]}>
            <Text style={{ color: "#888", fontFamily: "Poppins-Bold" }}>
              Other Skill
            </Text>

            <TextInput
              onChangeText={(val: any) => setSkillName(val)}
              onBlur={() => setFocus("")}
              onFocus={() => setFocus("pass")}
              maxLength={100}
              style={{
                borderBottomWidth: 1,
                width: "80%",
                padding: 5,
                minHeight:40,
                color: theme.text,
                borderColor: focused == "pass" ? "green" : "#888",
              }}
              value={skill_name}
              placeholderTextColor={"#999"}
              placeholder="Type your skill here..."
            />

            {skill_name &&
              skill_name?.trim().replace(" ", "").length > 3 &&
              !postLoading && (
                <TouchableOpacity
                  style={{ position: "absolute", right: 20, bottom: 20 }}
                  onPress={postNewSkill}
                >
                  <AntDesign name="plussquare" size={24} color={theme.text} />
                </TouchableOpacity>
              )}
          </View>

          <View style={{ borderWidth: 0.2, borderColor: "#999" }}></View>

          <View style={[globalstyles.column, { paddingTop: 20 }]}>
            <Text style={{ color: theme.text, fontFamily: "Poppins-Bold" }}>
              My Skills
            </Text>
            <Text
              style={{
                color: theme.text,
                fontWeight: "500",
                position: "absolute",
                right: 20,
                top: 5,
              }}
            >
              {userSkills ? userSkills.length : "0"}
            </Text>
          </View>

          {userSkills && (
            <View
              style={[
                globalstyles.rowEven,
                { flexWrap: "wrap", paddingVertical: 10 },
              ]}
            >
              {userSkills.map((item: any, index: number) => (
                <View
                  key={item.id}
                  style={[
                    globalstyles.row,
                    {
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      borderRadius: 25,
                      borderWidth: 1,
                      borderColor:'green',
                      gap: 10,
                      marginVertical:5
                    },
                  ]}
                >
                  <Text style={{ color: theme.text }}>{item.skill_name}</Text>

                  <Pressable onPress={() => deleteSkill(item.id)}>
                    <Entypo name="cross" size={24} color={theme.text} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <View style={{ borderWidth: 0.2, borderColor: "#999",marginVertical:10 }}></View>
          <Text style={{ color: theme.text, fontFamily: "Poppins-Bold" }}>
              Similar Skills
            </Text>
          <View style={[globalstyles.rowEven,{flexWrap:'wrap'}]}>
            {skills &&
              skills.map((item: any, index: any) => 
                <View
                  key={index}
                  style={[
                    globalstyles.row,
                    { paddingHorizontal: 10, 
                      borderColor:theme.text,
                      borderRadius: 25, borderWidth: 1, gap: 10, marginVertical:5 },
                  ]}
                >
                  <Text style={{ color: theme.text }}>{item}</Text>

                  <Pressable
                    onPress={() => setSkillName(item)}
                  >
                    <AntDesign name="plus" size={24} color={theme.text} />
                  </Pressable>
                </View>
              )}
          </View>
        </View>
      </ScrollView>
       
    </SafeAreaView>
  );
}
