import * as Location from "expo-location";

import { useEffect, useState } from "react";

import { LocationAccuracy } from "expo-location";

interface UseGeolocationOutput {
    position?: Location.LocationObject;
    error?: string;
}

const useGeolocation = (): UseGeolocationOutput => {
    const [position, setPosition] = useState<Location.LocationObject>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        let removeFunction: () => void;
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== Location.PermissionStatus.GRANTED) {
                setError("Permission to access location was denied");
                return;
            }

            const output = await Location.watchPositionAsync({
                timeInterval: 1000,
                accuracy: LocationAccuracy.BestForNavigation
            }, (currentPosition) => {
                setPosition(currentPosition)
            });
            removeFunction = output.remove;
        })();
        return () => {
            if (removeFunction) {
                removeFunction();
            }
        };
    }, []);

    return {
        position,
        error
    };
};

export default useGeolocation;