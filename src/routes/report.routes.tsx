import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions, useColorScheme, StatusBar } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import ReportExprences from "../screens/User/ReportExprences";
import ReportIncome from "../screens/User/ReportIncome";
import colors from "../../colors";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export function ReportRoutes() {
  let colorScheme = useColorScheme();
  const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 64;

  return (
    <Navigator
      initialRouteName="expenses"
      initialLayout={{ width: Dimensions.get("window").width }}
      screenOptions={{
        tabBarActiveTintColor: colors.content[150],
        tabBarInactiveTintColor: colors.content[150],
        tabBarStyle: {
          backgroundColor: colors.primary.DEFAULT,
          paddingTop: statusBarHeight + 16,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colorScheme === "dark" ? colors.content[150] : colors.content[100],
          height: colorScheme === "dark" ? 2 : 3,
        },
        tabBarLabelStyle: { fontSize: 17, fontWeight: "600", textTransform: "none" },
        tabBarItemStyle: { flexDirection: "row", height: 51 },
        tabBarIconStyle: { justifyContent: "center" },
        tabBarAndroidRipple: { borderless: false, color: colors.primary.focus },
      }}
      sceneContainerStyle={{
        backgroundColor: colorScheme === "dark" ? colors.base[600] : colors.base[150],
      }}
    >
      <Screen
        name="expenses"
        component={ReportExprences}
        options={{
          title: "Despesas",
          tabBarIcon: ({ color }) => <Icon name="arrow-down-circle" color={color} size={17} />,
        }}
      />
      <Screen
        name="income"
        component={ReportIncome}
        options={{
          title: "Receitas",
          tabBarIcon: ({ color }) => <Icon name="arrow-up-circle" color={color} size={17} />,
        }}
      />
    </Navigator>
  );
}
