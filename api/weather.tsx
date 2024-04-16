import axios from "axios";

const API_KEY = "";
const API_URL = `https://api.weatherapi.com/v1/`;

const apiCall = async (endpoint: string) => {
    try {
        const response = await axios.get(endpoint);

        return response.data;
    } catch (error) {
        console.log(error);

        return;
    }
}

const fetchLocations = (params: string) => {
    const url =`${API_URL}search.json?key=${API_KEY}&q=${params}`;
    return apiCall(url);
}

const fetchForecast = (params: string) => {
    const url =`${API_URL}forecast.json?key=${API_KEY}&q=${params}&days=7&aqi=no&alerts=no`;

    return apiCall(url);
}

export {fetchForecast, fetchLocations};