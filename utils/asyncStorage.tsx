import AsyncStorage from "@react-native-async-storage/async-storage";

const setData = async (key:string, value:string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log(error);
    }
}

const getData = async (key:string) => {
    try {
        const value = await AsyncStorage.getItem(key);

        return value;
    } catch (error) {
        console.log(error);
    }
}

export {setData, getData}