import { TouchableOpacity, Text } from "react-native";

export default function Button({ title, onPress, className = "" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-wine py-3 rounded-md ${className}`}
    >
      <Text className="text-white-smoke text-center font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
