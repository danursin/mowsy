import { Button, Dimensions, Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import React, { useState } from 'react';

import { LocationObject } from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { getPosition } from './services/PositionService';
import useGeolocation from './hooks/useGeolocation';

const App: React.FC = () => {

  const [positions, setPositions] = useState<LocationObject[]>([]);
  const { position, error } = useGeolocation();

  const captureLocation = async () => {
    try {
      const position = await getPosition();
      setPositions(currentPositions => [...currentPositions, position]);
    } catch (err) {
      alert(`Error getting location: ${err.message}`);
    }
  };

  const sendPositionEmail = () => {
    const url = `mailto:danursin@gmail.com?subject=Mowsy&body=${JSON.stringify([positions])}`;
    return Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {!!error && <Text>{error}</Text>}
      {!!position && <Text>
        Lat: {position.coords.latitude}
        {"\n"}
        Lng: {position.coords.longitude}
        {"\n"}
        Accuracy: {position.coords.accuracy}
        {"\n"}
        Altitude: {position.coords.altitude}
        {"\n"}
        Altitude Accuracy: {position.coords.altitudeAccuracy}
      </Text>}
      {!position && !error && <Text>Balls!</Text>}


      <Button title="Clear Polygon" onPress={() => setPositions([])} />
      <Button title="Capture Location" onPress={captureLocation} />
      <Button title="Send Data by Email" onPress={sendPositionEmail} />
      
      {!!position &&
        <MapView style={styles.map} initialRegion={{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          longitudeDelta: 0.001,
          latitudeDelta: 0.001
        }}>
        {!!positions.length && <Polygon coordinates={positions.map(({ coords: { latitude, longitude } }) => ({ latitude, longitude }))} strokeWidth={5} strokeColor="#567d46" />}
        <Marker coordinate={{latitude: position.coords.latitude, longitude: position.coords.longitude}} image={require("./assets/mower.png")}/>
        </MapView>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  }
});

export default App;
