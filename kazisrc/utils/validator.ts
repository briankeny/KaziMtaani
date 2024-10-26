
interface enforcerProps {
    [key: string]: any;
    minlength ?: number;
    type ?: string;
    canBeEmpty ?:boolean;
}

interface enforcerBuildProps {
    key:string;
    value:string;
    minlength ?: number;
    type ?: string;
    canBeEmpty ?:boolean;
}


interface  dataProps {
    [key: string]: any;
}

export function removeSpace(item:string) {
      if (item) {
        const noblank=  item.trim();
        const noSpace = noblank.replace(/\s/g, "");
        return noSpace;
      } 
      else {
        return "";
      }
 }  

export const validationBuilder =  (validationData:[...args:any])=>{
    let validatedData = {}
    validationData.map((item:any)=>{
        const obj = <dataProps> objectDestructurer(item);
        const { minlength,type='string',canBeEmpty=false} = item;
        const key = obj.key;
        const value = obj.val;


        const {data,pass,errorMessage} = ruleEnforcer({ key,value,minlength,type,canBeEmpty })
 
        if (pass) {
           
            validatedData = {...validatedData, ...data}
        }
        else{
            throw errorMessage
        }
    })
    return validatedData
}

// 
export function objectDestructurer(item:enforcerProps){
    const res = Object.entries(item).map(([key,val],index)=>{ if (index == 0) {return {"key":key,"val":val}}})
    return res[0]
}


// Enforce Validation Rules;
export function ruleEnforcer({key,value,minlength=2,type='string',canBeEmpty=false}:enforcerBuildProps){
    let data = <dataProps> {};
    let pass = false;
    let errorMessage:any = {};

    if (!canBeEmpty){
        try{

            if (type != "number"){
                const crtlen = removeSpace(value).length > minlength 
                if(!crtlen){
                    errorMessage[key] = `${formatNamecorrectly(key)} is ${value ?
                        "incorrect. Minimum Characters length is " + minlength 
                        :"missing"}`
                    return {data,pass,errorMessage}
                }
            }
    
           switch (type){
            case 'string':
            pass=true
            data[key]= value.trim()
             break 
             ;
    
            case 'number':           
                const isnum =  changeStringToNumbers(value)
              
                if(isnum){
                    pass = true
                 
                    data[key] = parseInt(value);
                }
                else{
                    errorMessage[key] =  `${key} must contain only numbers`              
         
                }
                break
                ;
            case 'email':
                const valuenospace = removeSpace(value)
                    const iscrtmail =  testEmail(valuenospace)
                     if(!iscrtmail){
                        errorMessage[key] =  `${value} is not a correct value for ${formatNamecorrectly(key)} address`              
                     }
                     else{
                        pass = true
                        data[key] = removeSpace(valuenospace) ;
                     }
                     break
                    ;
            case 'phonenumber':
                        const val = removeSpace(value)
                        const iscrtnum =  testPhoneNumber(val)
                         if(!iscrtnum){
                            errorMessage[key] =  `${value} is not a correct value for a phone number please check`              
                         }
                         else{
                            pass = true
                            data[key] = `+254${val}` ;
                         }
                         break;
            case 'float':
                    const {pass:ok,errm} =  formatToFloat(value)
                    if(!ok){
                            errorMessage[key] =  `${value} is not a correct value for ${key} ${errm} `              
                    }
                    else{
                            pass = true
                            data[key] = value ;
                    }
                break;
           case 'license':
                    const {correct,error} =  checkForCorrectNumberPlateFormating(value)
                    if(!correct){
                            errorMessage[key] =  `${value} is ${error}`              
                    }
                    else{
                            pass = true
                            data[key] = value ;
                    }
                break;
            case 'password':
                const nospace = removeSpace(value)
                    const {
                        isStrong,
                        strengthScore,
                        isLengthValid,
                        isLowerCaseValid,
                        isUpperCaseValid,
                        isNumbersValid,
                        isSpecialCharsValid
                    }=  testPasswordStrength(nospace)
                    if(isStrong){
                        pass = true
                        data[key] = nospace 
                    }
                    else{
                        errorMessage[key] =  `${nospace} passed ${strengthScore}/5 checks. 
                        Required Length ${minlength} Chars  ${isLengthValid?"passed":"failed"}, 
                        Has Lower Case Character ex. (s) ${isLowerCaseValid}
                        Has Upper Case Character ex. S ${isUpperCaseValid}, 
                        Contains a number ex.(1) ${isNumbersValid}, 
                        Has At Least One Special Character ex(@,#,$,&) ${isSpecialCharsValid}`                
                    }
                    break
                            ;    
            default: 
            break
            ;
          }    
      
        }
        catch(error:any){
        //    errorMessage = "Incorrect value provided"
        }
    }
    else{
        data[key]=value
        pass=true
    }
   
    return {data,pass,errorMessage}
  }
  


// This function tests a string if it contains only numbers

export const changeStringToNumbers = (number:string)=>{
    try{
    const t = number.toString()
    const no =   parseInt(t)
        return no
    }
    catch(error){
        return false;
    }
}

export const checkStrForPurelyNumbers = (str:string)=>{
    const numeric = str.replace(/[^0-9]/g, '')
    return numeric
}

// check for purely strings
export const checkStringForPurelyStrings = (str:string) => {
    const strOnly = str.replace(/[^a-zA-Z0-9' ']/gi, ''); // Updated regex pattern
    return strOnly;
}

export const alowedSpecialChars= ['@','!','_','-','$','&','+','?']
// This function tests a string if it contains Required characters

export const testStringForRequiredChars = (charstr:string) => {
    return alowedSpecialChars.some(char => charstr.includes(char));

}

// Test Password Strength
export function testPasswordStrength(password:string) {
    let strengthScore=0;
    // Define the criteria
    const minLength = 7;
    const minLowerCase = 1;
    const minUpperCase = 1;
    const minNumbers = 1;
    const minSpecialChars = 1;
    
    // Count the occurrences of different character types
    let lowerCaseCount = 0;
    let upperCaseCount = 0;
    let numberCount = 0;
    let specialCharCount = 0;

    for (const char of password) {
        if (/[a-z]/.test(char)) {
            lowerCaseCount++;
        } else if (/[A-Z]/.test(char)) {
            upperCaseCount++;
        } else if (/[0-9]/.test(char)) {
            numberCount++;
        } else if (/[^a-zA-Z0-9]/.test(char)) {
            specialCharCount++;
        }
    }
    
    // Check against the criteria
    const isLengthValid = password.length >= minLength;
    const isLowerCaseValid = lowerCaseCount >= minLowerCase;
    const isUpperCaseValid = upperCaseCount >= minUpperCase;
    const isNumbersValid = numberCount >= minNumbers;
    const isSpecialCharsValid = specialCharCount >= minSpecialChars;
    
    // Calculate the overall strength score
    isLengthValid ? strengthScore +=1 : null;
    isLowerCaseValid ? strengthScore +=1 :null;
     isUpperCaseValid ? strengthScore +=1 :null; 
     isNumbersValid ? strengthScore +=1 :null;
     isSpecialCharsValid? strengthScore += 1 : null;
    
    return {
        isStrong: strengthScore === 5,
        strengthScore,
        isLengthValid,
        isLowerCaseValid,
        isUpperCaseValid,
        isNumbersValid,
        isSpecialCharsValid
    };
}


export function formatNamecorrectly(name:string){
    try{
        const formated = name.replace(/_/gi,' ')
        return formated
    }
    catch(err:any){
        return name
    }
}


//Test Phone Number  
export const testPhoneNumber = (number:string) => {
    const phonePattern = /^[0-7]\d{2}\d{3}\d{3}/;
    const no = phonePattern.test(number);
    if (no) {
      return true;
    } else {
      return false;
    }
  };
  
// Test Email
  export const testEmail = (email:string) => {
    try {
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const emailNoSpace = removeSpace(email);
      const mail = emailPattern.test(emailNoSpace);
      if (email) {
        return mail;
      } else {
        return false;
      }
    }
    catch (error){
      return false
    }

   
  };


export  function checkforpurelyfloat(input:string){
    let result =''
    const dotCount = input.split('.').length - 1;
    if (dotCount !== 1 || input.startsWith('.')){
        result =''
    }
    result =  input.replace(/[^0-9.]+/g, '')
    return result
}
    // 

  

export  function formatToFloat(inputStr:string) {
    let errm = ''
    let pass = true
    // Count the number of dots in the input string
    const dotCount = inputStr.split('.').length - 1;

    // If there is more than one dot, or if the dot is at the beginning or end of the string, reject the input
    if (dotCount !== 1 || inputStr.startsWith('.') || inputStr.endsWith('.')) {
         errm  = ("Please provide a valid float value.");
        pass=false;
    }

    // Convert the string to a float
    const result = parseFloat(inputStr);

    // Check if the conversion was successful
    if (isNaN(result)) {
        errm = ("Please provide a valid float value.");
        pass =false;
    }

    return {pass,errm};
}


export function checkForCorrectNumberPlateFormating(plate:string){
    let error=''
    let correct = false
    const plate_upper = plate ? plate.toUpperCase(): ''
    const pattern1 = /^K[A-Za-z]{2} \d{3}[A-Za-z]*$/;
    const pattern2 = /^27CG\d{3}[A-Za-z]*$/;
    const pattern3 = /^GVN \d{3}[A-Za-z]*$/;
    const pattern4 = /^KHMA\d{3}[A-Za-z]*$/;

    if (plate_upper.startsWith('K')){
       const validity =   pattern1.test(plate_upper) && removeSpace(plate_upper).length == 7
       validity  ? correct=true : error='Incorrect Plate Number'
    }
    else if (plate.startsWith('27CG')){
        const validity =   pattern2.test(plate_upper)
        validity? correct=true : error='Incorrect Plate Number'

    }
    else if (plate.startsWith('KHMA')){
        const validity =   pattern4.test(plate_upper)
        validity? correct=true : error='Incorrect Plate Number'
    }
    else if (plate.startsWith('GVN')){
        const validity =   pattern3.test(plate_upper) && removeSpace(plate_upper).length == 7
        validity? correct=true : error='Incorrect Plate Number'
    }
    else {
        error='Incorrect Plate Number'
    }
    return {correct,error}
}
