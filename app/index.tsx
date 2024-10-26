import { Redirect } from 'expo-router'
import React from 'react'
import { useSelector } from 'react-redux'

const Index = () => {
  const {authentication} = useSelector((state:any)=>state.auth)
  return authentication? <Redirect href="/(app)"/> :  <Redirect href="/signin"/> 
}

export default Index