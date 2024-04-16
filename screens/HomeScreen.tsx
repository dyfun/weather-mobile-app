import React, {useCallback, useState, useEffect} from "react";
import { View, TextInput, Image, Text, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import  bgWhite  from "../theme";
import {CalendarDaysIcon, MagnifyingGlassIcon, MapPinIcon} from "react-native-heroicons/outline/";
import {debounce} from "lodash";
import {fetchLocations, fetchForecast} from "../api/weather"
import {weatherImages} from "../theme/weather"
import * as Progress from 'react-native-progress'
import {setData, getData} from "../utils/asyncStorage"

const HomeScreen = () => {
    const [searchBar, toggleSearchBar] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState<{
      location: Location;
      current: Current;
      forecast: Forecast;
    }>({
      location: {
        name: '',
        region: '',
        country: '',
        lat: 0,
        lon: 0,
        tz_id: '',
        localtime_epoch: 0,
        localtime: '',
      },
      current: {
        temp_c: 0,
        condition: {
          text: '',
        },
        wind_kph: 0,
        humidity: 0,
      },
      forecast: {
        forecastday: [],
      },
    });
    const [loading, setLoading] = useState(true);

    const handleLocation = (location: string) => {
      fetchForecast(location).then(data => {
        setWeather(data);
        setData('default', location);
      });
    }

    const handleSearch = (value: string) => {
      fetchLocations(value).then(data => {
        setLocations(data);
      });
    }

    const convertDateName = (param: string) => {
      let date = new Date(param);
      let name = date.toLocaleDateString('en-US', {weekday:'long'});

      return name.split(',')[0]
    }

    type Location = {
      name: string,
      region: string,
      country: string,
      lat: number,
      lon: number,
      tz_id: string,
      localtime_epoch: number,
      localtime: string
    }

    type Current = {
      temp_c : number,
      condition: {
        text : string
      },
      wind_kph : number,
      humidity: number,
    }

    type Forecastday = {
      date : string,
      day : {
        avgtemp_c : number,
        condition: {
          text : string
        }
      }
    }

    type Forecast = {
      forecastday : Forecastday[]
    }

    const {current, location, forecast}: {current: Current, location: Location, forecast: Forecast} = weather;

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    useEffect(() => {
      defaultLocationData();
    }, [])

    const defaultLocationData = async () => {
      const defaultData = await getData("default");
      const city = defaultData != null ? defaultData : "Ankara";

      fetchForecast(city).then(data => {
        setWeather(data);
        setLoading(false);
      });
    }

    return (
      <View className="flex-1 relative">
        <Image 
          blurRadius={70} 
          source={require('../assets/images/bg.png')} 
          className="absolute h-full w-full"
        />

        {
          loading ? (
            <View className="flex-1 flex-row justify-center item-center">
              <Text className="">Loading....</Text>
              <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
            </View>
          ) : (
            <SafeAreaView className="mt-4 flex flex-1">
            <View className="mx-4 relative z-50">
              <View className="flex-row justify-end items-center rounded-full z-50"
                style={{backgroundColor: searchBar? bgWhite(0.2) :  'transparent'}}>
                {
                  searchBar ? (
                    <TextInput 
                    onChangeText={handleTextDebounce}
                    placeholder='search city' 
                    placeholderTextColor={'lightgray'}
                    className="pl-6 h-10 flex-1 text-base text-white"
                  />
                  ) : ""
                }
                <TouchableOpacity
                  onPress={() => toggleSearchBar(!searchBar)}
                  style={{backgroundColor : bgWhite(0.3)}}
                  className="rounded-full p-3 m-1"
                  >
                    <Text>
                      <MagnifyingGlassIcon size="20" color="white"/>
                    </Text>
                  </TouchableOpacity>
              </View>
              {
                locations.length > 0 && searchBar ? (
                  <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                    {
                      locations.map((x, i) => {
                        let showBorder = i+1 < locations.length ? "border-b-2 border-b-gray-400" : "";
                        return (
                          <TouchableOpacity
                            onPress={() => handleLocation(x["name"])}
                            key={i}
                            className ={`flex-row items-center border-0 p-3 px-4 mb-1 ${showBorder}`}
                          >
                            <MapPinIcon size="15" color="gray"/>
                            <Text className="text-black text-lg ml-2">{x["name"]}, {x["country"]}</Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                ) : ""
              }
            </View>
            <View className="mx-4 flex justify-around flex-1 mb-2">
              <Text className="text-white text-center text-2xl font-bold">
                {location?.name},
                <Text className="text-lg font-semibold text-gray-200">{location?.country}</Text>
              </Text>
              <View className="flex-row justify-center">
                <Image
                  source={weatherImages[current?.condition?.text || 'other']}
                  className="w-52 h-52"
                  />
              </View>
              <View className="space-y-2">
                <Text className="text-center font-bold text-white text-6xl ml-5">
                  {current?.temp_c}&#176;
                </Text>
                <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}&#176;
                </Text>
              </View>
              <View className="flex-row justify-between mx-4">
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/images/icons/wind.png")}
                    className="h-6 w-6"
                    />
                  <Text className="text-white font-semibold text-base">
                  {current?.wind_kph}km
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/images/icons/drop.png")}
                    className="h-6 w-6"
                    />
                  <Text className="text-white font-semibold text-base">
                    {current?.humidity}%
                  </Text>
                </View>
                <View className="flex-row space-x-2 items-center">
                  <Image
                    source={require("../assets/images/icons/sun.png")}
                    className="h-6 w-6"
                    />
                  <Text className="text-white font-semibold text-base">
                    6:05 AM
                  </Text>
                </View>
              </View>
            </View>
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size="17" color="white"/>
                <Text className="text-white text-base">
                  Daily Forecast
                </Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{paddingHorizontal: 15}}
                showsHorizontalScrollIndicator={false}
              >
                {
                  forecast?.forecastday?.map((x, i) =>{
                    console.log(x.day?.condition?.text || 'other');
                    return (
                      <View 
                      key={i}
                      className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                      style={{backgroundColor: bgWhite(0.15)}}
                      >
                        <Image source={weatherImages[x.day?.condition?.text]} className="h-11 w-11"/>
                        <Text className="text-white">{convertDateName(x.date)}</Text>
                        <Text className="text-white text-xl font-semibold">{x.day.avgtemp_c}&#176;</Text>
                    </View>
                    );
                  })
                }
              </ScrollView>
            </View>
          </SafeAreaView>
          )
        }
      </View>
    );
  }

export default HomeScreen;