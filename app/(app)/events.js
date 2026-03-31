//tools
import React, {useState, useEffect} from "react";
import { AppText } from "../../components/AppText";
import { View, StyleSheet } from "react-native";
import {db, getDatabase, ref, query, orderByChild, startAt, onValue} from "../../lib/firebase";
////export of event screen
export default function EventScreen() {
    
   const [events, setEvents] = useState([]);
   const [loading, setLoading] = useState(true);
   
   return (
//main container
        <View className="justify-center flex-1 p-4">
        <AppText center>Event Screen</AppText>
        </View>
    );
    }
