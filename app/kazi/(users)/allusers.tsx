import { useGetResourceMutation } from "@/store/services/authApi";
import { useAppDispatch } from "@/store/store";
import { globalstyles } from "@/styles/styles";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

const  UsersScreen = () => {
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );
    const {authError} = useSelector((state: any) => state.auth);
    
    const [getUserData, { isLoading, isError, error, isSuccess }] = useGetResourceMutation();
  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
  </SafeAreaView>
  )
}

export default UsersScreen