import Axios from "axios"
import React, {useEffect, useState} from "react"
import { Text, StatusBar, StyleSheet, View, SafeAreaView ,TextInput, Button, TouchableOpacity , Image} from "react-native"
const OrderCard: (props) => React$Node = ({item, trackUrl, pickup, dropoff, navigation, route, heading, status, truck, orderId, quote_id }) => {
    const [truckPos, setTruckPos]  = useState("10%")
    // console.log(item.id)
    useEffect(() => {
        // console.log(item["updatedDelivery"])
        console.log()
        if (item["updatedDelivery"]){
            // console.log(item)
        
        if (item["updatedDelivery"].status == "ongoing") {
            setTruckPos("50%")
        } else if (item["updatedDelivery"].status == "dropoff") {
            setTruckPos("75%")
        } else if (item["updatedDelivery"].status == "delivered"){
            setTruckPos("85%")
        }
    }
    }, [status])
    const camelize = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
      }

    return (
        <TouchableOpacity onPress={() => {
            var a = ""
            Axios.get(`https://us-central1-saymile-a29fa.cloudfunctions.net/api/getDriverLocation/${quote_id}`, )
            .then(res => {
                console.log(res)
                a  = res;
                navigation.navigate("ViewOrderMap", {
                    pickup: pickup,
                    dropoff: dropoff,
                    currLoc: a,
                    trackUrl: trackUrl,
                    item: item
                })
                
            }).catch(err => {
                console.log(err)
                navigation.navigate("ViewOrderMap", {
                    pickup: pickup,
                    dropoff: dropoff,
                    currLoc: "unavailable",
                    trackUrl: trackUrl, 
                    item: item
                })
            })
            
        }} style={styles.container}>
            <Text style={styles.orderId}>
                {(item.id)}
            </Text>
            <Text style={styles.heading}>
                {(item.pickup.name)}
            </Text>
            <View>
            <Text style={{
                marginTop: "2%",
                fontSize: 12,
                marginLeft: 5,
                fontFamily: "Avenir"
            }}>
                Dropoff at: {item.dropoff.address}
            </Text>
          
            </View>
            <View style={{
                borderColor: "#A9A9A9",
                width: "80%",
                borderWidth: 0.3,
                display: "flex",
                alignSelf: "center",
                top: "27%"
            }}></View>
            <View style={styles.gEllipse}></View>
            <View style={styles.mEllipse}></View>

            <Image style={[styles.truck, {
                left: truckPos
            }]} source={truck} />
            
            {/* <Image></Image> */}
        </TouchableOpacity>

    )
}
const styles = StyleSheet.create({
    orderId: {
        color: "#A9A9A9",
        fontSize: 12,
        marginLeft: 5,
        fontFamily: "Avenir"
    },
    truck: {
        width: 20,
        height: 20,
        padding: 10,
        position: "relative",
        top: "20%",
        // left: ,
        // bottom: 50,
        backgroundColor: "rgb(100, 186, 203)",
        borderRadius: 20,
        resizeMode: "contain"
    },
    gEllipse: {
        width: 20,
        height: 20,
        top:"80%",
        left: "5%",
        backgroundColor: "grey",
        borderRadius: 50,
        // display: "flex",
        position: "absolute"
        // justifyContent: "center",
        // marginBottom: 20
    }, 
    mEllipse: {
        width: 20,
        height: 20,
        top:"80%",
        right: "5%",
        borderRadius: 50,
        // display: "flex",
        position: "absolute",
        backgroundColor: "#F2C94C"
    },
    heading:{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: "5%",
        marginLeft: 5,
        fontFamily: "Avenir"
    },
    container: {
        display: "flex",
        padding: 15,
        margin: 10,
        // borderColor: "black",
        // borderWidth: 0.5,
        borderRadius: 25,
        height: 190,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        
        elevation: 4,
        backgroundColor: 'white'

    }
})

export default OrderCard;

