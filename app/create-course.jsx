import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AddressAutocomplete from "../components/AddressAutocomplete";

export default function CreateCourse() {
    const router = useRouter();

    const [clientId, setClientId] = useState(null);
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [emailClient, setEmailClient] = useState("");
    const [adresseRamassage, setAdresseRamassage] = useState("");
    const [coordsRamassage, setCoordsRamassage] = useState({ lat: null, lon: null });
    const [adresseLivraison, setAdresseLivraison] = useState("");
    const [coordsLivraison, setCoordsLivraison] = useState({ lat: null, lon: null });
    const [typeDeCourse, setTypeDeCourse] = useState("Standard");

    // Récupérer l'ID du client connecté
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) {
                    Alert.alert("Erreur", "Utilisateur non connecté");
                    return;
                }

                const response = await fetch("http://10.0.2.2:8000/api/client/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const data = await response.json();
                if (response.ok || data.client) {
                    setClientId(data.client.id);
                } else {
                    Alert.alert("Erreur", "Impossible de récupérer le client connecté");
                }
            } catch (error) {
                console.error("Erreur récupération client :", error);
                Alert.alert("Erreur", "Impossible de récupérer le client connecté");
            }
        };

        fetchClient();
    }, []);

    const handleCreateCourse = async () => {
        if (!titre || !description || !adresseRamassage || !adresseLivraison || !emailClient) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        if (!clientId) {
            Alert.alert("Erreur", "Client non trouvé, reconnectez-vous");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                Alert.alert("Erreur", "Utilisateur non connecté");
                return;
            }

            const response = await fetch("http://10.0.2.2:8000/api/courses", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: clientId,
                    titre,
                    description,
                    adresseRamassage,
                    adresseLivraison,
                    typeDeCourse,
                    emailClient,
                    latitudeRamassage: coordsRamassage.lat,
                    longitudeRamassage: coordsRamassage.lon,
                    latitudeLivraison: coordsLivraison.lat,
                    longitudeLivraison: coordsLivraison.lon,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Succès", "Course créée avec succès !");
                router.back(); // ✅ Remplace navigation.goBack()
            } else {
                Alert.alert("Erreur", data.message || "Impossible de créer la course");
            }
        } catch (error) {
            console.error("Erreur création course :", error);
            Alert.alert("Erreur", "Une erreur est survenue");
        }
    };

    return (
        <ScrollView className="flex-1 bg-white pt-10 p-6">
            <Text className="text-2xl font-bold text-[#5B2333] mb-6 text-center uppercase">
                Nouvelle Course
            </Text>

            <Text className="text-lg font-semibold mb-1">Titre :</Text>
            <TextInput
                value={titre}
                onChangeText={setTitre}
                placeholder="Ex: Livraison de documents"
                className="border border-gray-300 rounded-lg p-4 mb-4"
            />

            <Text className="text-lg font-semibold mb-1">Description :</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Détails de la course"
                multiline
                className="border border-gray-300 rounded-lg p-4 mb-4"
            />

            <Text className="text-lg font-semibold mb-1">Email du destinataire :</Text>
            <TextInput
                value={emailClient}
                onChangeText={setEmailClient}
                placeholder="Entrez l'email du destinataire"
                keyboardType="email-address"
                className="border border-gray-300 rounded-lg p-4 mb-4"
            />

            <Text className="text-lg font-semibold mb-1">Adresse de ramassage :</Text>
            <AddressAutocomplete
                value={adresseRamassage}
                onChange={({ address, latitude, longitude }) => {
                    setAdresseRamassage(address);
                    setCoordsRamassage({ lat: latitude, lon: longitude });
                }}
                placeholder="Entrez l'adresse de ramassage"
            />

            <Text className="text-lg font-semibold mb-1 mt-4">Adresse de livraison :</Text>
            <AddressAutocomplete
                value={adresseLivraison}
                onChange={({ address, latitude, longitude }) => {
                    setAdresseLivraison(address);
                    setCoordsLivraison({ lat: latitude, lon: longitude });
                }}
                placeholder="Entrez l'adresse de livraison"
            />

            <Text className="text-lg font-semibold mb-1 mt-4">Type de course :</Text>
            <View className="flex-row gap-4 mb-6">
                {["Standard", "Express", "Premium"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setTypeDeCourse(type)}
                        className={`px-8 py-2 rounded-lg border ${typeDeCourse === type
                                ? "bg-[#5B2333] border-[#5B2333]"
                                : "bg-white border-gray-300"
                            }`}
                    >
                        <Text className={`${typeDeCourse === type ? "text-white" : "text-gray-700"}`}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                onPress={handleCreateCourse}
                className="bg-[#5B2333] rounded-2xl py-4"
            >
                <Text className="text-white text-center text-lg font-semibold">
                    Créer la course
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
