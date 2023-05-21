import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "./src/context/AuthContext";
import { Routes } from "./src/routes";

export default function App() {
  let colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaView className="flex-1">
          <Routes />
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </SafeAreaView>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
