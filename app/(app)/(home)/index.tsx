import { logo } from '@/images/images'
import { useGetResourceMutation } from '@/store/services/authApi'
import { useAppDispatch } from '@/store/store'
import { globalstyles } from '@/styles/styles'
import { dateDifferenceWithUnit } from '@/utils/utils'
import React, { useRef } from 'react'
import { SafeAreaView, View,Text, Pressable,Image, FlatList, TouchableOpacity } from 'react-native'
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
    <View style={[globalstyles.card,{backgroundColor:theme.cardBackground,marginTop:1,
    borderColor:'green',borderWidth:1}]}>

        <View style={[globalstyles.rowWide]}>
        
          <View style={[globalstyles.row,{gap:10}]}>
              <Image source={logo} 
              style={{width:50,height:50,borderRadius:25}}
              />
              <View>
                <Text 
                  style={{
                    fontWeight:'500',
                    paddingVertical:2,
                    color:theme.text}}
                >
                  Poster
                </Text>
                <Text 
                  style={{color:'#888',fontSize:10}}
                >
                  @Poster
                </Text>
              </View>
          </View>
          
          <View style={[globalstyles.column]}>
            <Text style={[{color:theme.text,fontSize:11}]}>
              {time}
            </Text>
          </View>
        
        </View>


        <View style={[{marginVertical:20,padding:10}]}>
        <Text
         style={[{color:theme.text, fontWeight:'500'}]}
        >{item.title}</Text>
        <Text numberOfLines={1} 
        style={[{color:theme.text}]}
        ellipsizeMode='tail'>{item.description}</Text>
        </View>
       
        <View style={[globalstyles.rowWide]}>
          <Text style={[{color:theme.text,fontSize:11}]}>
            {time}
          </Text>
          <TouchableOpacity
        style={[{alignSelf:'center',
           borderWidth:1,
          borderRadius:20,borderColor:'#888'
        }]}

        ><Text style={[{textAlign:'center',color:theme.text,
        fontWeight:'500',paddingHorizontal:10,paddingVertical:5}]}>
          Read More</Text>
          </TouchableOpacity>

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