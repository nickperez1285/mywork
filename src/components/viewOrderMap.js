import React, {useEffect, useState} from "react"
import { Text, StatusBar, StyleSheet, View, SafeAreaView ,TextInput, Button, TouchableOpacity , Image, Dimensions} from "react-native"
// MapboxGL.setAccessToken("pk.eyJ1Ijoic2FteWFra3VtYXIiLCJhIjoiY2toMTducGV4MDNmbTJ4czd5ajN5aDNlciJ9.QiOtmIj-fix89hB63SXg5A")
import MapView, {Marker, Polyline, AnimatedRegion, MapViewAnimated, Animated} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import WebView from "react-native-webview";
import MapModal from "./mapModal"
import useInterval from "../hooks/useInterval"
import Axios from "axios";
const ViewOrderMap: (props) => React$Node = ({navigation, route, orderId }) => {
    const pickup = route.params.pickup;
    const dropoff = route.params.dropoff;
    const item = route.params.item;
    const [dropoffRef, setDropoffRef] = useState(null)
    const [pickupRef, setPickupRef] = useState(null)
    const [courierRef, setCourierRef] = useState(null);
    const [delStatus, setDelStatus] = useState("Pending...")
    const [courier, setCourier] = useState(null);
    const [mode, setMode] = useState("DRIVING")
    const [courierLoc, setCourierLoc] = useState(new AnimatedRegion({
      latitude: pickup.lat,
      longitude: pickup.lng,
      latitudeDelta: pickup.lat,
      longitudeDelta: pickup.lng
    }))
    const [courierImage, setCourierImage] = useState(require("../../assets/img/icons8-tracking.png"))
    var screenLoaded = false;
    useEffect(() => {
      if (!screenLoaded) {
        getUpdatedDelivery()
        screenLoaded = true;
      }
    })
    useEffect(() => {
      // console.log(courierRef)
      if (courier) {
        if (courier.vehicle_type == "bicycle") {
          setMode("CYCLING")
        } 
        setCourierImage(courier.img_href)
        // courier.redraw()
        courierLoc.timing({
          latitude: courier.location.lat,
          longitude: courier.location.lng,
          latitudeDelta: pickup.lat,
          longitudeDelta: pickup.lng,
          duration: 50,
          useNativeDriver: false
        }).start()
      }
     })
    const getUpdatedDelivery = () => {
      // console.log(item.quote_id)
        // console.log("heradfaefawefwefsdafasdsadfsd");
        // Axios.get().then
        Axios.get(`https://us-central1-saymile-a29fa.cloudfunctions.net/api/getDelivery/${item.quote_id}`).then(res => {
          // console.log("heaklfjhadlkfjads")
          // console.log(res.data.data)
          const delObject = res.data.data;
          // console.log(delObject)
          // console.log(delObject["updatedDelivery"])
          if (delObject["updatedDelivery"]){
            const updatedDelivery = delObject["updatedDelivery"];
            // console.log(updatedDelivery)
            if (updatedDelivery["status"] == "delivered") {
              // console.log("here")
              // console.log(delStatus, "status")
              setDelStatus("Your order is complete and has been dropped off")
          } else if (updatedDelivery["status"] == "Pending") {
              setDelStatus("We are looking for a courier...")
  
          } else if (updatedDelivery["status"] == "pickup_complete") {
              setDelStatus("Order is on the way!")
  
          } else if (updatedDelivery["status"] == "dropoff") {
              setDelStatus("Your order is apporaching")
          } else if (updatedDelivery["status"] == "canceled") {
              setDelStatus("Delivery is cancelled")
          } else if (updatedDelivery["status"] == "returned") {
              setDelStatus("Delivery is cancelled and we are returning the items to the sender")
          } else if (updatedDelivery["status"] == "ongoing") {
              setDelStatus("The delivery is on the works!")
          } else if (updatedDelivery["status"] == "pickup") {
              setDelStatus("Courier is picking up your order")
          }
            setCourier(updatedDelivery.data.courier)
            // console.log(courier)
          }
        })
    }
    // Store name
    useInterval(getUpdatedDelivery, 5000)


    const initRegion = {
        latitude: (pickup.lat + dropoff.lat) / 2,
        longitude: (pickup.lng + dropoff.lng) / 2,
        latitudeDelta: Math.abs(dropoff.lat - pickup.lat) * 1.5,
        longitudeDelta: Math.abs(dropoff.lng - pickup.lng) * 1.5
    }
    const animatedRegion = new AnimatedRegion({
      latitude: initRegion.latitude,
      longitude: initRegion.longitude,
      latitudeDelta: initRegion.latitudeDelta,
      longitudeDelta: initRegion.longitudeDelta
    })
    // console.log(pickup)
    // console.log(dropoff)
    // console.log(route.params.item["pickup"]["address"])
        return (
          <View>
          
          {/* // <SafeAreaView style={styles.container}> */}
            <MapView initialRegion={initRegion} zoomControlEnabled={true} style={styles.mapStyle}>
            <Text style={{ shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        
        elevation: 4,
        backgroundColor: 'white', borderRadius: 100, paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2, fontWeight: "bold" , backgroundColor: "white", left: 10, top: "1%", position:"absolute", fontSize: 12, fontFamily: "Avenir" }}>{delStatus}</Text>

            {/* {courier && <MapViewDirections
            timePrecision={"now"}
            mode={mode}
            precision={"high"}
            origin={{latitude: pickup.lat, longitude: pickup.lng}}
            destination={{latitude: dropoff.lat, longitude: dropoff.lng}}
            apikey={"AIzaSyCI4Kv-gl-PW5DPDRIY1rBr0JXJ-4wGzFA"}
            strokeWidth={3}
            optimizeWaypoints={true}
            strokeColor="rgb(105, 188, 204)"
            />}
            <MapViewDirections
            timePrecision={"now"}
            mode={mode}
            precision={"high"}
            origin={{latitude: pickup.lat, longitude: pickup.lng}}
            destination={{latitude: dropoff.lat, longitude: dropoff.lng}}
            apikey={"AIzaSyCI4Kv-gl-PW5DPDRIY1rBr0JXJ-4wGzFA"}
            strokeWidth={3}
            optimizeWaypoints={true}
            strokeColor="rgb(105, 188, 204)"
            /> */}
            <MapView.Marker.Animated style={{aspectRatio: 4}}
            image={require("../../assets/img/icons8-marker.png")} ref={ref1 => setPickupRef(ref1)} isPreselected={true} coordinate={{
                latitude: pickup.lat,
                longitude: pickup.lng
            }} flat={true} title={"Pickup"} description={`${route.params.item["pickup"]["name"]}`} />
            <MapView.Marker.Animated style={{
              aspectRatio: 4
            }} image={require("../../assets/img/icons8-tracking.png")} ref={(ref) => {
              setDropoffRef(ref);
              // console.log("ref ref ref ref ref")
            }} isPreselected={true} coordinate={{
                latitude: dropoff.lat,
                longitude: dropoff.lng
            }} flat={true} title={"Dropoff"} description={`${route.params.item["dropoff"]["address"]}`} />
            
            <MapView.Marker.Animated 
            style={{
              aspectRatio: 4
            }} image={courierImage} ref={(marker) => setCourierRef(marker)} isPreselected={true} 
            coordinate={courierLoc} flat={true} title={"Dropoff"} description={"Courier"} />

          
            </MapView>
            <MapModal item={item} courier={courier} status={delStatus} pickupAddress={route.params.item["pickup"]["address"]} dropoffAddress={route.params.item["dropoff"]["address"]}>
          </MapModal>
            </View>
          
          // </SafeAreaView>
            // <SafeAreaView style={styles.container}>
            // <WebView
            // scrollEnabled={false}
            // scalesPageToFit={true}
            //  style={{
            //   height: Dimensions.get("window").width,
            // }} source={{uri: route.params.trackUrl}}>

            // </WebView>
            // </SafeAreaView>
        );
      }
    
    const styles = StyleSheet.create({
      container: {

        flex: 1,
        overflow: "hidden"
        // backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
      },
      mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
    });

export default ViewOrderMap;