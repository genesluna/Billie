import { StatusBar, View, Image, Pressable, GestureResponderEvent } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import Button from "./common/Button";
import colors from "../../colors";
import Text from "./common/Text";
import { User } from "../models/User";

const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

type HomeHeaderProps = {
  appUser: User;
  onProfilePress: (event: GestureResponderEvent) => void;
};

/**
 * Component that renders the header for the home screen.
 *
 * @param appUser - The currently logged-in user.
 * @param onProfilePress - A function called when the user profile is pressed.
 *
 * @returns JSX element representing the home screen header.
 */
const HomeHeader = ({ onProfilePress, appUser }: HomeHeaderProps) => {
  const { logout } = useAuth();

  return (
    <View
      className="flex-row items-center justify-between h-40 p-4 pb-[72] bg-primary"
      style={{ paddingTop: statusBarHeight }}
    >
      <Pressable className="flex-row items-center" onPress={onProfilePress}>
        {!appUser?.photoURL ? (
          <View className="w-12 h-12 p-3 rounded-full bg-primary-focus dark:bg-base-350">
            <Icon name="user" color={colors.content[150]} size={24} />
          </View>
        ) : (
          <Image source={{ uri: appUser.photoURL }} resizeMode="contain" className="w-12 h-12 rounded-full resize" />
        )}
        <Text size="base" className="ml-4 font-medium text-content-100">
          Olá, {appUser?.name?.split(" ")[0]}
        </Text>
      </Pressable>
      <Button icon="log-out" iconOnly onPress={logout} />
    </View>
  );
};

export default HomeHeader;
