import AsyncStorage from "@react-native-community/async-storage";
import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet} from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { TextInput } from "react-native-gesture-handler";
const addressCard = (item) => {
    return (
        <View>

        </View>
    )
}

const YourAccount = ({ navigation, route }) => {
    
    const [userAddresses, setUserAddresses] = useState(null)
    const [currAddress, setCurrAddress] = useState("")
    // ()
    useEffect(() => {
        AsyncStorage.getItem("USER", (err, res) => {
            console.log(res)
            const body = JSON.stringify({ user_id: res });
            fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/getUser", {
					method: "POST",
					mode: "cors",
					body: body,
				}).then(res => {
                    res.json().then(dat => {
                        fetch("https://us-central1-saymile-a29fa.cloudfunctions.net/api/listAllCards/" + dat.user_data.user_stripe_id, {
                            method: "GET",
                            mode: "cors",
                        }).then(result => {
                            result.json().then(cards => {
                                console.log(cards.response.data)
                                var address = []
                                cards.response.data.map(item => {
                            address.push({
                                label: item.brand + " " + "****" + item.last4,
                                value: item.id
                            })
                        })
                        setUserAddresses(address)
                            })
                        })
            
                        
                    })
                })
        })
    }, [])

    return (
        <View style={styles.container}>
            <View style={{width: "90%"}}>
                <Text style={{
                    marginBottom: "4%"
                }}>
                    Addresses: 
                </Text>
            {userAddresses != null &&<DropDownPicker
                items={userAddresses}
                containerStyle={{height: 40, width: "80%"}}
                dropDownStyle={{backgroundColor: '#fafafa', height: 100}}
                onChangeItem={item => setCurrAddress(item.value)}
            ></DropDownPicker>
            }
            {userAddresses != null && <View style={styles.editAddresses}>
                <Text style={{marginBottom: "5%"}}>Edit Address: </Text>
                <View>
                    <Text>Address Line 1</Text>
                <TextInput style={{width: "90%", backgroundColor: "white", padding: 10, borderRadius: 8}} value={currAddress}></TextInput>
                    </View>
                </View>}
            </View>
            {/* <Text>Hello</Text> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        display: "flex",
        flex: 1,
        alignItems: "center",
        width: "100%",
        padding: "5%"
        
    },
    editAddresses: {
        marginTop: "10%",
        width: "100%"
    }

})

export default YourAccount;