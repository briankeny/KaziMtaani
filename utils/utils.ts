//remove Space
export function removeSpace(item:string) {
    const noSpace = item.trim().replace(/\s/g, "");
      if (noSpace) {
        return noSpace;
      } else {
        return item;
      }
 }  


// Return duration from specified date
export function dateDifferenceWithUnit(startDate:any) {
  // Parse the input date strings
  const startDateObj = new Date(startDate);
  const endDateObj = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(endDateObj.getTime() - startDateObj.getTime());

  // Define the time units and their respective milliseconds
  const timeUnits = [
    { unit: "yr", milliseconds: 365 * 24 * 60 * 60 * 1000 },
    { unit: "month", milliseconds: 30 * 24 * 60 * 60 * 1000 },
    { unit: "wk", milliseconds: 7 * 24 * 60 * 60 * 1000 },
    { unit: "day", milliseconds: 24 * 60 * 60 * 1000 },
    { unit: "hr", milliseconds: 60 * 60 * 1000 },
    { unit: "min", milliseconds: 60 * 1000 },
  ];

  // Find the largest unit that fits into the time difference
  for (const { unit, milliseconds } of timeUnits) {
    if (timeDifference >= milliseconds) {
      const difference = Math.floor(timeDifference / milliseconds);
      return `${difference} ${unit}${difference > 1 ? "s" : ""} ago`;
    }
  }

  // If the difference is less than a minute
  const difference = Math.floor(timeDifference / 1000);
  return `${difference} second${difference > 1 ? "s" : ""} ago`;
}

// Format date correctly for ui display
export function dateFormater(date:any){
  if(date){
    try{
      const today = new Date(date);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dat = `${day}/${month}/${year}`;
      
      const h = today.getUTCHours();
      const hrs = String(today.getUTCHours()+1).padStart(2, "0");
      const mins = String(today.getUTCMinutes()).padStart(2, "0");

      const am = ()=>{
          if (h >= 0 && h <= 12){
              return "AM"
          }
          else{
              return "PM"
          }
      }
      const utc = am()
      const time = `${hrs}:${mins} ${utc}` 


      return {dat, time};
  }
  catch(err){
      const dat = "";
      const time = ""; 
      return {dat,time}
  }
  }
  else {
    const dat = "";
      const time = ""; 
      return {dat,time}
  }
}



// async function sendEmailOTP(email:number) {
//   try{
//     const data = [{
//       email_adress:email,
//       type:'email',
//       minlength:11, 
//       canBeEmpty:false
//     }]
//     const validated = validationBuilder(data)
//     const resp = await postData({data:validated,endpoint:'/email-otp/'}).unwrap()
//     if (resp.isSuccess){
//       const message = resp?.data?.message
//        //  Create a notification
//       rendermodal({
//         dispatch: dispatch,
//         header: "Success",
//         status: "success",
//         content: message,
//       })
//        //  Proceed to next step
//        setIndex(index+1)
//     } 
//     else{
//       throw new Error('Server Error')
//     }
//   }
//   catch(error:any){
//     rendermodal({
//       dispatch: dispatch,
//       header: "Error",
//       status: "error",
//       content: error.message,
//     })
//   }
// }

// async function verifyEmailOTP(emailotp:string) {
//   try{
//     const data = [{
//       email_otp:emailotp,
//       type:'email',
//       minlength:11, 
//       canBeEmpty:false
//     }]
//     const validated = validationBuilder(data)
//     const resp = await postData({data:validated,endpoint:'/email-otp/verif/'}).unwrap()
//     if (resp.isSuccess){
//       const message = resp?.data?.message
//        //  Create a notification
//       rendermodal({
//         dispatch: dispatch,
//         header: "Success",
//         status: "success",
//         content: message,
//       })
//        //  Proceed to next step
//        setIndex(index+1)
//     } 
//     else{
//       throw new Error('Server Error')
//     }
//   }
//   catch(error:any){
//     rendermodal({
//       dispatch: dispatch,
//       header: "Error",
//       status: "error",
//       content: error.message,
//     })
//   }
// }