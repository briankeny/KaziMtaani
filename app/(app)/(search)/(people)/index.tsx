import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import React from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

export function  PeopleScreen () {
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector((state: any) => state.modal);
    const {authError} = useSelector((state: any) => state.auth);    
    const [getUserData, { isLoading, isError, error, isSuccess }] = useGetResourceMutation();
   
    return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
  </SafeAreaView>
  )
}
