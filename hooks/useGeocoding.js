import { useState } from "react"; 

export default function useGeocoding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //Address to coords
  const geocode = async (address) => {
    const apiKey = process.env.EXPO_PUBLIC_GEOCODE_API_KEY;
    try {
    setLoading(true);
    setError(null);

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    const data = await res.json();
    console.log("GEOCODE RAW RESPONSE:", data);
    if (data.status !== "OK" || !data.results.length) {
      throw new Error("Address not found");
    }

    const location = data.results[0].geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
      displayName: data.results[0].formatted_address,
    };

  } catch (err) {
    setError(err.message);
    return null;
  } finally {
    setLoading(false);
  }
};

  //coords to address
  const reverseGeocode = async (lat, lng) => {
    const apiKey = process.env.EXPO_PUBLIC_GEOCODE_API_KEY;
  try {
    setLoading(true);
    setError(null);

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const data = await res.json();

    if (data.status !== "OK" || !data.results.length) {
      throw new Error("Address not found");
    }

    return {
      address: data.results[0].formatted_address,
    };

  } catch (err) {
    setError(err.message);
    return null;
  } finally {
    setLoading(false);
  }
};

  return {
    geocode,
    reverseGeocode,
    loading,
    error
  };
}