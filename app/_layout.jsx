import { Stack } from "expo-router";

import "../global.css"

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: "#5B2333"},
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { color: "#FFFFFF"},
            headerShown: false,
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="create-course" options={{ headerShown:true, title:"COURSES" }}/>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
    );
}
