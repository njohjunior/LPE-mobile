import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tracking() {
  const [courseId, setCourseId] = useState("");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackCourse = async () => {
    if (!courseId) {
      Alert.alert("Erreur", "Veuillez entrer un ID de course");
      return;
    }

    setLoading(true);
    setCourse(null);

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erreur", "Utilisateur non connecté");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://10.0.2.2:8000/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCourse(data); // ou data.course si ton backend renvoie { course: {...} }
      } else {
        Alert.alert("Erreur", data.message || "Course introuvable");
      }
    } catch (error) {
      console.error("Erreur récupération course :", error);
      Alert.alert("Erreur", "Impossible de récupérer la course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-6 pt-24">
      <Text className="text-2xl font-bold text-[#5B2333] mb-6 text-center">Suivi de Course</Text>

      <TextInput
        placeholder="Entrez l'ID de la course"
        value={courseId}
        onChangeText={setCourseId}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg p-4 mb-4"
      />

      <TouchableOpacity
        onPress={handleTrackCourse}
        className="bg-[#5B2333] rounded-xl py-4 mb-6"
      >
        <Text className="text-white text-center text-lg font-bold">Suivre</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#5B2333" className="mb-4" />
      )}

      {course && (
        <View className="bg-gray-100 rounded-2xl p-4 shadow">
          <Text className="text-xl font-bold text-[#5B2333] mb-2">{course.titre}</Text>
          <Text className="text-gray-700 mb-1">
            📍 <Text className="font-bold">Adresse de ramassage:</Text> {course.adresseRamassage}
          </Text>
          <Text className="text-gray-700 mb-1">
            🎯 <Text className="font-bold">Adresse de livraison:</Text> {course.adresseLivraison}
          </Text>
          <Text className={`mt-2 p-2 w-1/3 font-semibold uppercase text-white text-center rounded-xl ${course.status === 'disponible' ? 'bg-green-600' : 'bg-orange-600'}`}>
            {course.status}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
