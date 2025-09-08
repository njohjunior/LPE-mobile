import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, ScrollView } from "react-native";
import axios from "axios";

export default function AddressAutocomplete({ value, onChange, placeholder = "" }) {
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = async (text) => {
        // Met à jour la valeur du champ
        onChange({ address: text, latitude: null, longitude: null });

        if (text.length > 2) {
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${text}&countrycodes=CM&limit=5`,
                    {
                        headers: {
                            "User-Agent": "LPE/1.0 (njohjunior4@gmail.com)",
                        },
                    }
                );
                setSuggestions(response.data);
            } catch (error) {
                console.error("Erreur récupération adresses:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (item) => {
        onChange({
            address: item.display_name,
            latitude: item.lat,
            longitude: item.lon,
        });
        setSuggestions([]);
    };

    return (
        <View className="mb-4">
            <TextInput
                value={value}
                onChangeText={handleChange}
                placeholder={placeholder}
                className="border border-gray-300 rounded-lg p-4 bg-white"
            />

            {suggestions.length > 0 && (
                <ScrollView
                    className="bg-white border border-gray-200 rounded-lg mt-2 max-h-60"
                    nestedScrollEnabled
                >
                    {suggestions.map((item) => (
                        <TouchableOpacity
                            key={item.place_id}
                            onPress={() => handleSelect(item)}
                            className="p-3 border-b border-gray-200"
                        >
                            <Text className="text-gray-700">{item.display_name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}
