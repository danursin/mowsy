import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";

export const getPosition = async (): Promise<Location.LocationObject> => {
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error(status);
    }

    const location = await Location.getCurrentPositionAsync({
        timeInterval: 1000,
        accuracy: LocationAccuracy.BestForNavigation
    });

    return location;
};