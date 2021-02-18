import React, { useEffect, useState } from "react"
import Modal from 'react-native-modal';
import { Text, StatusBar, StyleSheet, View, Animated, SafeAreaView, TextInput, Button, TouchableOpacity, Image, Dimensions } from "react-native"
import Unorderedlist from 'react-native-unordered-list';
import { Circle } from "react-native-maps";

const MapModal: (props) => React$Node = ({ courier, status, pickupAddress, dropoffAddress, navigation, route, orderId, item }) => {
    const [showModal, setShowModal] = useState(true);
    const [expandModal, setExpandModal] = useState(false);
    const [heightView, setHeightView] = useState(new Animated.Value(Dimensions.get("window").width * 0.6))
    const [gotCourier, setGotCourier] = useState(false);
    // const [delStatus, setDelStatus] = useState(status);
    // console.log()


    useEffect(() => {
        if (courier) {
            setGotCourier(true)
        }
    }, [])
    useEffect(() => {
        if (expandModal) {
            Animated.timing(heightView, {
                toValue: Dimensions.get("window").width * 1.5,
                timing: 10,
                useNativeDriver: false
            }).start()
        } else {
            Animated.timing(heightView, {
                toValue: Dimensions.get("window").width * 0.6,
                timing: 10,
                useNativeDriver: false
            }).start()
        }
    }, [expandModal])
    return (
        <Modal style={{
            // justifyContent: "flex-end",
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: "-109%",
        }} onSwipeStart={() => {
            setExpandModal(!expandModal)
        }} swipeDirection={['up', 'down']} hasBackdrop={false} coverScreen={false} backdropColor={null} isVisible={showModal}>
            <Animated.View style={{
                height: heightView, shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
                backgroundColor: "white", borderRadius: 35, padding: 20
            }}>
                <TouchableOpacity style={{
                    // display: "flex",
                    // alignSelf: "center",
                    // marginTop: "-18%",
                    position: "relative",
                    top: -25,
                    left: "45%",
                    backgroundColor: "white",
                    padding: 5,
                    borderRadius: 50,
                    width: 24
                }} onPress={() =>
                    setExpandModal(!expandModal)}>
                    <Image source={require("../../assets/img/icons8-menu.png")}></Image>
                </TouchableOpacity>
                {/* {gotCourier &&  */}
                <View style={{
                    marginTop: "-5%",
                    fontFamily: "Avenir"
                }}>
                    {/* {status == "delivered" && <View style={{ fontSize: 12}}><Text>Items Delivered: {item.updatedDelivery.data.manifest_items.map(stuff => {
                    <Unorderedlist><Text>{stuff.name} x {stuff.quantity}</Text></Unorderedlist>
                })}</Text></View>} */}
                    {courier != undefined && status != "delivered" && <Text style={{fontFamily: "Avenir",  fontSize: 12 }}>Courier Name: {courier != undefined && courier.name != null ? courier.name : "Looking for courier..."}</Text>}
                    {courier != undefined && status != "delivered" && <Text style={{fontFamily: "Avenir",  fontSize: 12 }}>Courier Phone: {courier != undefined && courier.name != null ? courier.phone_number : "Looking for courier..."}</Text>}
                    {item.manifest_items != undefined && <View style={{fontFamily: "Avenir",  fontSize: 12 }}>
                        <Text style={{fontFamily: "Avenir",  fontSize: 12}}><Text style={{fontWeight: "bold", fontSize: 14 }}>Order Details</Text> {"\n"} 
                        {item.manifest_items.map(stuff => {
                        console.log(stuff)
                        return (<Text style={{ fontSize: 12 }}>{stuff.quantity}x {stuff.name}{"\n"}</Text>)
                    })}</Text></View>}

                    {courier != undefined && <Image source={courier.img_href}></Image>}
                </View>
                {/* <Text style={{ fontSize: 15}}>Dropoff: {dropoffAddress}</Text> */}

            </Animated.View>
        </Modal>
    )
}

export default MapModal;
