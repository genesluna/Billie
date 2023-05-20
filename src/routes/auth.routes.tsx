import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

import EmailValidation from "../screens/Auth/EmailValidation";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import Register from "../screens/Auth/Register";
import Login from "../screens/Auth/Login";
import colors from "../../colors";

const { Screen, Navigator } = createNativeStackNavigator();

export function AuthRoutes() {
  let colorScheme = useColorScheme();

  return (
    <Navigator
      initialRouteName="login"
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: colorScheme === "dark" ? colors.content[150] : colors.content[400],
        headerStyle: { backgroundColor: colorScheme === "dark" ? colors.base[400] : colors.base[50] },
        animation: "slide_from_right",
      }}
    >
      <Screen
        name="login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="register"
        component={Register}
        options={{
          title: "Registro do Proprietário",
        }}
      />
      <Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={{
          title: "Recuperação de senha",
        }}
      />
      <Screen
        name="emailValidation"
        component={EmailValidation}
        options={{
          title: "Verificação de e-mail",
        }}
      />
    </Navigator>
  );
}
