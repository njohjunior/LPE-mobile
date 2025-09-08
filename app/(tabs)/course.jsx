import { useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch("http://10.0.2.2:8000/api/client/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error("Erreur API :", response.status);
        setCourses([]);
      } else {
        let data = await response.json();
        data = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setCourses(data || []);
      }
    } catch (error) {
      console.error("Erreur récupération courses :", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#5B2333" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-24 p-4">
      {/* Bouton Créer une nouvelle course */}
      <TouchableOpacity
        className="bg-[#5B2333] rounded-xl py-4 mb-6 shadow-lg"
        onPress={() => router.push("/create-course")}
      >
        <Text className="text-white text-center text-lg font-bold">
          + Créer une nouvelle course
        </Text>
      </TouchableOpacity>

      {/* Liste des courses */}
      {courses.length === 0 ? (
        <Text className="text-center text-gray-500 text-lg mt-10">
          Vous n'avez encore créé aucune course.
        </Text>
      ) : (
        courses.map((course) => (
          <View
            key={course.id}
            className="bg-white rounded-2xl p-5 mb-4 shadow-md"
          >
            <Text className="text-2xl font-bold text-[#5B2333] uppercase mb-3">
              {course.titre}
            </Text>

            <View className="mb-3">
              <Text className="text-gray-700 mb-1">
                📍 <Text className="font-semibold text-[#5B2333]">Ramassage :</Text> {course.adresseRamassage}
              </Text>
              <Text className="text-gray-700">
                🎯 <Text className="font-semibold text-[#5B2333]">Livraison :</Text> {course.adresseLivraison}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text
                className={`px-3 py-1 font-semibold uppercase text-white rounded-full ${course.status === "disponible"
                  ? "bg-green-600"
                  : "bg-orange-500"
                  }`}
              >
                {course.status}
              </Text>
              <Text className="text-gray-400 text-sm">
                {new Date(course.created_at).toLocaleDateString()}{" "}
                {new Date(course.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
