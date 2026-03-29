import { useState } from "react";
import polyline from "@mapbox/polyline";
export default function useRoute(){
    const [routeCoords, setRouteCoords] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const clearRoute = () => {
        setRouteCoords([]);
        setDistance(null);
        setDuration(null);
    }
    const getRoute = async (origin, destination) => {
        if (!origin){
            alert("No starting location available.")
            return;
        }
        try {
            clearRoute;
            //Add api call when I get render up and running.
            const res = await fetch(

            )
        }
    }

}
