import { useState } from "react";

export default function useGeocoding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //Address to coords
  const geocode = async (address) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=${encodeURIComponent(address)}`,
        {
            headers: {
            "User-Agent": "deni-app (student project)",
            "Accept": "application/json"
            }
        }
        );

      const data = await res.json();

      if (!data || data.length === 0) {
        throw new Error("Address not found");
      }

      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
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
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
            headers: {
            "User-Agent": "deni-app (student project)",
            "Accept": "application/json"
            }
        }
      );

      const data = await res.json();

      if (!data) {
        throw new Error("Address not found");
      }

      return {
        address: data.display_name
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