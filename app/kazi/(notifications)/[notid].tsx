
import { useGetResourceMutation } from "@/store/services/authApi";
import { useAppDispatch } from "@/store/store";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

export default function NotificationScreen () {
    const {notid} = useLocalSearchParams()
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );
    const {authError} = useSelector((state: any) => state.auth);
    const [getUserData, { isLoading, isError, error, isSuccess }] = useGetResourceMutation();
    return (
          <SafeAreaView>
              {/* <FlatList/> */}
          </SafeAreaView>
    )
  }