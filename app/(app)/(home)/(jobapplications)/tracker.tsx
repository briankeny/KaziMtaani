import Toast from '@/kazisrc/components/Toast';
import { clearModal } from '@/kazisrc/store/slices/modalSlice';
import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { formatDateToString } from '@/kazisrc/utils/utils';
import { Entypo } from '@expo/vector-icons';
import React from 'react'
import { SafeAreaView, View,Text, ScrollView,Image } from 'react-native';

export default function JobTrackerScreen(){
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const {jobApplication} = useSelector((state:any)=>state.jobs)
    const {userData} = useSelector((state:any)=>state.auth)
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );
    function closeModal() {
        dispatch(clearModal());
        return true;
      }


    function BannerItem({status='',showArrow=true,activeColor=theme.text}:any) {
        return(
        <View style={[globalstyles.row,{gap:1}]}>
            <View style={[globalstyles.columnCenter]}>
                  <Entypo name="circle" size={24} color={activeColor ? activeColor : theme.text} />
                <Text style={{color:theme.text, fontWeight:'600'}}>{status}</Text>
            </View>
            {showArrow &&<Entypo name= 'arrow-long-right' size={24} color={activeColor}  />}
        </View>
    )
    }

    function Banner(){
        const all_steps =   [ 'pending','applied','reviewed','accepted','declined']
        return(
            <View style={[globalstyles.rowEven]}>
                <BannerItem 
                 status='Pending'
                 activeColor={ all_steps.includes(jobApplication.status) ? 'green' :theme.text }
                />

                <BannerItem 
                 status='Review'
                 activeColor={ all_steps.includes(jobApplication.status) ? 'green' :theme.text }
                />
                
                <BannerItem 
                 status='Accepted'
                 showArrow={false}
                 activeColor={ jobApplication?.status === 'accepted' ? 'green' :theme.text }
                />
                
                 
                {jobApplication.status == 'declined' &&
                <BannerItem 
                 status='Declined'
                 showArrow={false}
                 activeColor={ jobApplication?.status === 'declined' ? 'red' :theme.text }
                />
                }

            </View>
        )
    }

    return(
    <SafeAreaView style={[globalstyles.safeArea, { backgroundColor: theme.background }]}>
    <ScrollView>
        <View style={[globalstyles.card,{backgroundColor:theme.card}]}>
                <Text style={{padding:20,
                 fontSize:21,
                color:theme.text,fontFamily:'Poppins-Bold', 
                    textAlign:'center'
                }}>
                    {jobApplication?.jobpost?.title}
                </Text>

                <Text style={{color:'#888',textAlign:'center',fontSize:22,
                    marginVertical:20
                }}>Ref no #{jobApplication.id}</Text>
          
    
            <Banner/>


            <View style={{borderColor:'#999',width:'100%',borderWidth:0.2,marginVertical:20}}></View>
   
            
        <View style={[globalstyles.column,{elevation:1 , marginVertical:20}]}>
            <Text style={{color:theme.text, fontFamily:'Poppins-Bold',
            textAlign:'center'
            }}>Application Details</Text>
            <View style={{borderColor:'#999',width:'20%',
                alignSelf:'center',
                borderWidth:0.2,marginTop:5,marginBottom:30}}></View>

            <View style={[globalstyles.rowWide,{marginVertical:1}]}>
                <Text style={{color:theme.text}}>Applicant</Text>  
                <Text style={{color:theme.text,fontWeight:'600'}}>{userData.full_name}</Text>
            </View>
            <View style={[globalstyles.rowWide,{marginVertical:8}]}>
                <Text style={{color:theme.text}}>Status</Text>  
                <Text style={[{ fontWeight:'600',
                    color:jobApplication?.status == 'declined' ? 'red': 'orange'}]}>
                        {jobApplication.status}</Text>
            </View>

            <View style={[globalstyles.rowWide,{marginVertical:8}]}>
                <Text style={{color:theme.text}}>Candidate Score</Text>  
                <Text style={{color:theme.text,fontWeight:'600'}}>{jobApplication.score}</Text>
            </View>
          
            <View style={[globalstyles.rowWide,{marginVertical:8}]}>
                <Text style={{color:theme.text}}>Date of Application</Text>  
                {jobApplication.application_date &&
                <Text style={{color:theme.text,fontWeight:'600'}}>{formatDateToString(jobApplication.application_date)}</Text>
                }
            </View>

            <View style={[globalstyles.rowWide,{marginVertical:8}]}>
                <Text style={{color:theme.text}}>Approval Date</Text>  
                {jobApplication.approval_date &&
                <Text style={{color:theme.text, fontWeight:'600'}}>{formatDateToString(jobApplication.approval_date)}</Text>
                }
            </View>
         </View>


         <View style={{borderColor:'#999',width:'100%',borderWidth:0.2,marginVertical:20}}></View>
           
         <View style={[globalstyles.column]}>
             
             <Text style={{color:theme.text,paddingVertical:20,fontFamily:'Poppins-Bold'}}>
              Posted on  {formatDateToString(jobApplication.jobpost.date_posted)}
            </Text>

                {jobApplication.jobpost.job_picture &&
                <Image
                  style={{aspectRatio:4/3}}
                 source={{uri:jobApplication.jobpost.job_picture}}
                />
                }
  
            <Text style={{color:theme.text, paddingVertical:20, fontFamily:'Poppins-Regular'}}>
                 {jobApplication.jobpost.description}
            </Text>

         </View>

        </View> 
     
    </ScrollView>
    <Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
    </SafeAreaView>
    )
}
