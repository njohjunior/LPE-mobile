import { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/login");
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-wine">
            <Image
                source={require("../assets/images/logo.png")}
                className="w-32 h-32 mb-6"
                resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-white-smoke">
                LE POINT EXPRESS
            </Text>
        </View>
    );
}
