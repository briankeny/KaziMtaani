
// export default function HomeScreen(){
//     const { theme, isNightMode } = useSelector((state: any) => state.theme);
//     const { userData,authentication } = useSelector((state: any) => state.auth);
//     const [getData, { isLoading,isError,error,isSuccess}] = useGetResourceMutation();
  
//     async function fetchNewNotifications(){
//       try{
//         await getData({endpoint:`/notifications/`})
//       }
//       catch(error){
  
//       }
//     } 
  
//     function goToScreen(screen:any){
//         router.replace(screen)
//     }
  
  
  
//     const Menu = ({
//       Icon,
//       onPress,
//       iconSize = 24,
//       iconColor = "#888",
//       contentTextColor="#fff",
//       headerTextColor='#fff',
//       header = "",
//       content = "",
//       iconName = "",
//       backColor = "",
//     }: HomeMenuProps) => {
    
//       return (
//         <TouchableOpacity
//           style={[
//             globalstyles.card,
//             { width: "35%", margin: 4, elevation: 6 },
//             { backgroundColor: backColor ? backColor : theme.card },
//           ]}
//           onPress={onPress}
//         >
//           <View style={[globalstyles.column, { paddingLeft: 5 }]}>
//             <Text style={[{ color:contentTextColor,fontSize:16,fontWeight:600 }]}>
//               {content}
//             </Text>
//             <Text style={[ { color:headerTextColor,fontSize:11,paddingVertical:5 }]}>
//               {header}
//             </Text>
//           </View>
  
//           <Icon
//             style={[{ position: "absolute", right: 25, top:10 }]}
//             name={iconName}
//             size={iconSize}
//             color={iconColor}
//           />
//         </TouchableOpacity>
//       );
//     };
  
//     return (
//       <SafeAreaView
//         style={[globalstyles.safeArea, { backgroundColor: theme.background}]}
//       >
  
//           <View style={[globalstyles.row,{gap:0,paddingHorizontal:20,paddingVertical:10}]}>
//             <Text  style={[{
//               color:theme.text
//               ,fontSize:20,
//               fontWeight:'600'
              
//             }]}>
//             Hi {userData?.full_name}
//             </Text>
//             <HelloWave
//                helloStyle = {{paddingHorizontal:10}}
//                helloStyleText = { {
//                 fontSize: 28,
//                 lineHeight:33,
//               }}
//             />
//             </View>
  
//           <View style={[globalstyles.columnStart,{  paddingHorizontal:20,paddingVertical:10}]}>
//              <Text style={{
//               color:'green',
//               fontSize:22,
//               fontFamily:'Poppins-Bold'
//              }}>
//                 Find Your Dream Job Here
//              </Text>
//           </View>
         
  
//         <View style={[globalstyles.card,{elevation:2,backgroundColor:'rgb(0, 102, 51)',width:'80%'}]}>
  
//             <View style={[globalstyles.row,{alignSelf:'center',padding:10,gap:10}]}>
//               <Text style={[{color:'#fff',fontSize:30,fontWeight:'600'}]}>300</Text>
//               <Text style={[{color:'#fff',paddingTop:10}]}>posts</Text>
//             </View>
  
//           <View style={[globalstyles.rowEven]}>
//             <View style={[globalstyles.row,{gap:20}]}>
//               <Text style={[{color:'#fff'}]}>Open</Text>
//               <Text style={[{color:'#fff',fontWeight:'600',fontSize:18}]}>{230}</Text>
//             </View>
  
//             <View style={[globalstyles.row,{gap:20}]}>
//               <Text style={[{color:'#fff'}]}>Closed</Text>
//               <Text style={[{color:'#fff',fontWeight:'600',fontSize:18}]}>{70}</Text>
//             </View>
//           </View>
  
//         </View>
  
  
//         <Text style={[{color:theme.text,fontWeight:'500',padding:20}]}>My Analytics</Text>
              
//         <View style={[globalstyles.rowEven,{overflow:'hidden',flexWrap:'wrap',columnGap:2}]}>
  
//          <Menu
//                 header="Profile visits"
//                 headerTextColor={theme.text}
//                 contentTextColor={theme.text}
//                 backColor={theme.card}
//                 content="360"
//                 iconColor="rgb(177, 137, 2)"
//                 iconSize={21}
//                 iconName="users"
//                 Icon={FontAwesome}
//                 onPress={() => goToScreen("Transport")}
//               />
  
//               <Menu
//                 header="Impressions"
//                 headerTextColor={theme.text}
//                 contentTextColor={theme.text}
//                 backColor={theme.card}
//                 content="4000"
//                 iconColor={'red'}
//                 iconSize={28}
//                 iconName="bar-chart"
//                 Icon={MaterialIcons}
//                 onPress={() => goToScreen("Transport")}
//               />
  
  
//               <Menu
//                 header="Search Appearances"
//                 headerTextColor={theme.text}
//                 contentTextColor={theme.text}
//                 backColor={theme.card}
//                 content="40"
//                 iconColor="rgb(106, 90, 205)"
//                 iconSize={21}
//                 iconName="search"
//                 Icon={MaterialIcons}
//                 onPress={() => goToScreen("Transport")}
//               />
  
//               <Menu
//                 header="Job posts Reviews"
//                 content="4"
//                 headerTextColor={theme.text}
//                 contentTextColor={theme.text}
//                 backColor={theme.card}
//                 iconColor="orange"
//                 iconSize={28}
//                 iconName="reviews"
//                 Icon={MaterialIcons}
//                 onPress={() => goToScreen("Transport")}
//               />
  
//             </View>
  
  
//       </SafeAreaView>
//     );
//   };
  
  
//   export function JobList (){
//     return( 
//     <View>
  
//     </View>
//     )
//   }