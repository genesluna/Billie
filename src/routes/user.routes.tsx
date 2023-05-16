import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

import Home from "../screens/user/Home";
import colors from "../../colors";
const { Screen, Navigator } = createNativeStackNavigator();

export function UserRoutes() {
  let colorScheme = useColorScheme();

  return (
    <Navigator
      initialRouteName="home"
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: colors.content[150],
        headerStyle: { backgroundColor: colors.primary.DEFAULT },
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colorScheme === "dark" ? colors.base[600] : colors.base[150] },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          title: "Billie",
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
    </Navigator>
  );
}
