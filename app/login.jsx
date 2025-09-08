import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Button from "../components/Button";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Stocker le token et les infos du client
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userData", JSON.stringify(data.client));

        router.replace("/(tabs)/tracking");
      } else {
        Alert.alert("Erreur", data.message || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur");
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white-smoke">
      <LottieView
        source={require("../assets/lotties/Tracking.json")}
        autoPlay
        loop
        style={{ width: 250, height: 250 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full border border-gray-300 rounded-md py-5 p-3 mb-4 bg-white"
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-gray-300 rounded-md py-5 p-3 mb-6 bg-white"
      />

      <Button title="Se connecter" onPress={handleLogin} className="mt-2 w-full" />

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text className="mt-4 text-wine font-semibold">
          Pas encore de compte ? Créez-en un
        </Text>
      </TouchableOpacity>
    </View>
  );
}
