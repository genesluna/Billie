import { StatusBar } from "expo-status-bar";
import { SafeAreaView, useColorScheme } from "react-native";
import Home from "./src/screens/Home";

export default function App() {
  let colorScheme = useColorScheme();

  return (
    <SafeAreaView className="flex-1">
      <Home />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}
