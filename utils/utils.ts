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

export const randomKeyGenerator = () => {
  return Math.random().toString(36).substr(2, 10);
};


export function generateRandomUserName(full_name:string){
  try{
    const rand_index = Math.random() < 0.5 ? 2 : 1
    const name = removeSpace(full_name).slice(0,10);
    const noun = randomKeyGenerator()
    const u_name = `${name}${rand_index == 1 ? '_'+ noun :'_'+ noun+'_'}`
    return u_name
  }
  catch(err){
    return randomKeyGenerator()
  }
}