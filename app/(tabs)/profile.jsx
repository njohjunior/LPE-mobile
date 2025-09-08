import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile() {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          console.log("Aucun token trouvé");
          setLoading(false);
          return;
        }

        const response = await fetch("http://10.0.2.2:8000/api/client/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error("Erreur récupération profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Oui",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("userToken");
            router.replace("/login");
          }
        }
      ]
    );
  };


  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#5B2333" />
      </View>
    );
  }

  if (!client) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-lg">Impossible de charger le profil</Text>
      </View>
    );
  }

  const user = client.client;

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar et titre */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=" + user.id }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-2xl text-center font-bold text-[#5B2333] uppercase min-w-full">{user.nom} {user.prenom}</Text>
        </View>

        {/* Infos utilisateur */}
        <View className="bg-gray-100 rounded-2xl p-4 mb-4 min-w-full shadow">
          <Text className="text-lg font-semibold">Email</Text>
          <Text className="text-gray-700">{user.email}</Text>
        </View>

        <View className="bg-gray-100 rounded-2xl p-4 mb-4 min-w-full shadow">
          <Text className="text-lg font-semibold">Téléphone</Text>
          <Text className="text-gray-700">{user.phone}</Text>
        </View>

        {/* Boutons */}
        <TouchableOpacity
          className="bg-[#5B2333] rounded-xl py-3 mb-4 min-w-full"
          onPress={handleEditProfile}
        >
          <Text className="text-white text-center font-semibold text-lg">Modifier le profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 rounded-xl py-3 mb-4 min-w-full"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-semibold text-lg">Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
