import { useGetResourceMutation } from '@/store/services/authApi'
import { useAppDispatch } from '@/store/store'
import { globalstyles } from '@/styles/styles'
import { dateDifferenceWithUnit } from '@/utils/utils'
import React, { useRef } from 'react'
import { SafeAreaView, View,Text, Pressable, FlatList } from 'react-native'
import { useSelector } from 'react-redux'

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const swipeableRowRef = useRef<any>(null)
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  // const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
  //   (state: any) => state.modal
  // ); 
  // const {jobads} = useSelector((state:any)=>state.messages) 
  const [getUserData, { data, isLoading, isError, error, isSuccess }] = useGetResourceMutation();

  async function fetchJobAds() {
    try{
       await getUserData({endpoint:'/job-adverts/'})
    }
    catch(error:any){
      console.log(error.message)
    }
  }
  return (
    <SafeAreaView
      style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
        <FlatList
          keyExtractor={(item)=> item.advert_id.toString()}
          data={jobexamples}
          renderItem={
            ({item,index}:{item:any,index:number})=>
              <JobCard
              item={item}
              theme={theme}
              key={index}
              />
          }
          

        />
    </SafeAreaView>
  )
}

export default HomeScreen


export function JobCard({item,theme}:any){
  const time = dateDifferenceWithUnit(item.date)
  return(
    <View style={[globalstyles.card,{backgroundColor:theme.card}]}>

        <View style={[globalstyles.columnEnd]}>
          <Text style={[{color:theme.text,fontSize:11}]}>
            {time}
          </Text>
        </View>

        <Text
         style={[{color:theme.text, fontWeight:'500'}]}
        >{item.title}</Text>
        <Text numberOfLines={1} 
        style={[{color:theme.text}]}
        ellipsizeMode='tail'>{item.description}</Text>
       
        <Pressable
        style={[{width:'50%',alignSelf:'center'}]}

        ><Text style={[{textAlign:'center',color:theme.text,fontWeight:'500',padding:5}]}>
          Read More</Text>
          </Pressable>

        <View style={[globalstyles.rowWide]}>
          <Text style={[{color:theme.text,fontSize:11}]}>
            {time}
          </Text>
          <Text style={[{color:theme.text,fontSize:11}]}>
            {time}
          </Text>
        </View>

    </View>
  )
} 



export const jobexamples = [
  {
    advert_id:1,
    title:'Laundry Cleaner',
    description: 'Iam Looking for a laundry cleaner around Kahawa Sukari to help me do my laundry today',
    date:'2020-03-03',
    status:'closed'
  },
  {
    advert_id:2,
    title:'Laundry Cleaner',
    description: 'Iam Looking for a laundry cleaner around Kahawa Sukari to help me do my laundry today',
    date:'2020-03-04',
    status:'open'
  }
]