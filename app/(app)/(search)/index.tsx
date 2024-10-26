import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";

export default function SearchScreen(){
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );
    return(
        <SafeAreaView
        style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
            
        </SafeAreaView>
    )
}