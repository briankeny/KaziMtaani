import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveString = async (key:any, value:any) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error:any) {
    return false;
  }
};

export const save = async (key:String, value:any) =>
  saveString(key, JSON.stringify(value));

export const get = async (key:string) => {
  try {
    const itemString = await AsyncStorage.getItem(key);
    if (itemString) {
      return JSON.parse(itemString);
    } else {
      return null;
    }
  } catch (error:any) {
    return null;
  }
};

export const removeFromStorage = async (key:any) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return true;
  }
};


export const clearAsyncStorage= async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    return true;
  }
};
 

//get all data from async storage 
export const getAllData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const allData = await AsyncStorage.multiGet(allKeys);

    return allData
  } catch (error) {
    // Error retrieving data
  }
};