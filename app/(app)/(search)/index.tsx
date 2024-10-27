import { Redirect, router } from "expo-router"
import { useSelector } from "react-redux"

export default function SearchScreen(){    
    const {userData} = useSelector((state:any)=>state.auth)
    return( userData.account_type == 'recruiter'? <Redirect href={'/(app)/(people)'} /> :<Redirect href={'/(app)/(jobs)'} />  ) 
}