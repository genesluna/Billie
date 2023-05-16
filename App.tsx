import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Routes } from "./src/routes";

export default function App() {
  let colorScheme = useColorScheme();

  return (
    <>
      <Routes />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}
