import { SafeAreaView, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Routes } from "./src/routes";
import { AuthProvider } from "./src/context/AuthContext";

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
