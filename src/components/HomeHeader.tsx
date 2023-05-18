import { StatusBar, View, Image } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import colors from "../../colors";
import Text from "./common/Text";
import Button from "./common/Button";

const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

const HomeHeader = () => {
  const { authUser, logout } = useAuth();

  return (
    <View
      className="flex-row items-center justify-between h-40 p-4 pb-[72] bg-primary"
      style={{ paddingTop: statusBarHeight }}
    >
      <View className="flex-row items-center">
        {!authUser?.photoURL ? (
          <View className="w-12 h-12 p-3 rounded-full bg-primary-focus dark:bg-base-350">
            <Icon name="user" color={colors.content[150]} size={24} />
          </View>
        ) : (
          <Image source={{ uri: authUser.photoURL }} resizeMode="contain" className="w-12 h-12 rounded-full resize" />
        )}
        <Text size="base" className="ml-4 font-medium text-content-100">
          Olá, {authUser?.displayName?.split(" ")[0]}
        </Text>
      </View>
      <Button icon="log-out" iconOnly onPress={logout} />
    </View>
  );
};

export default HomeHeader;
