import { StyleSheet } from "react-native";
export const globalstyles = StyleSheet.create({
    safeArea:{
        flex:1
    },
    column:{
        display: 'flex',
        flexDirection:'column',
    },
    columnCenter:{
        display: 'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    columnEnd:{
        display: 'flex',
        flexDirection:'column',
        alignItems:'flex-end',
        justifyContent:'flex-end' 
       },
    columnStart:{
        display: 'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'flex-start' 
       },
    row:{
        display: 'flex',
        flexDirection:'row'
    },
   rowEven : {
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-evenly'

    },
    rowWide:{
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    rowNarrow:{
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    card:{
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal:20,
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        alignSelf: "center",
        width: "99%"
    },
    inputBorder: {
        height: 44,
        textAlign: "center",
        marginTop: 30,
        width:  '80%',
        borderColor: "#777",
        borderWidth: 1,
        marginBottom: 10
      },
      error: {
        textAlign:'center',
        color: 'red',
        paddingVertical: 10,
      },
});