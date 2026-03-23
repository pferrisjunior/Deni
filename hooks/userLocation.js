import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

const useUserLocation = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);

    const getUserLocation = async () => {

        try {

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }

            let { coords } = await Location.getCurrentPositionAsync({});

            if (coords) {

                const { latitude, longitude } = coords;

                setLatitude(latitude);
                setLongitude(longitude);

                console.log("USER LOCATION:", latitude, longitude);
            }

        } catch (error) {

            console.log("LOCATION ERROR:", error);
            setErrorMessage("Unable to retrieve location");

        }
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    return { latitude, longitude, errorMessage };
};

export default useUserLocation;

