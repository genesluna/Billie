import "react-native-gesture-handler";
import { SafeAreaView, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "./src/context/AuthContext";
import { Routes } from "./src/routes";

export default function App() {
  let colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <SafeAreaView className="flex-1">
        <Routes />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </SafeAreaView>
    </AuthProvider>
  );
}
