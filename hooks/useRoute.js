import { useState } from "react";
import polyline from "@mapbox/polyline";
import { auth } from "../lib/firebase"
export default function useRoute() {
    const [route, setRoute] = useState(null);
    const [coords, setCoords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getRoute = async (origin, destination, mode) => {
        try {
            setLoading(true);
            setError(null);
            const user = auth.currentUser;

            if (!user) {
                throw new Error("User not authenticated");
            }

            const token = await user.getIdToken();
            const response = await fetch("https://routes-api-1gfa.onrender.com/route", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    origin,
                    destination,
                    mode,
                }),
            });
            if (!response.ok) {
                const text = await response.text();
                console.log("SERVER ERROR:", text);
                throw new Error("Route request failed");
            }
            const data = await response.json();
            const decoded = polyline.decode(data.polyline).map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng,
            }));
            setRoute(data);
            setCoords(decoded);
        } catch (err) {
            console.error("Route error:", err);
            setError(err);
        } finally {
            setLoading(false);
        }

    };
    const clearRoute = () => {
        setRoute(null);
        setCoords([]);
        setError(null);
    };

    return {
        route,
        coords,
        loading,
        error,
        getRoute,
        clearRoute,
        distanceText: route?.distance ?? "",
        durationText: route?.duration ?? "",
    };
}


