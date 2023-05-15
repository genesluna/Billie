import { View, Image, ViewProps } from "react-native";
import React from "react";

import Logo from "../../../../assets/billie-logo.png";

type HeaderProps = ViewProps & {};

/**
 * A component that displays the App logo as the header of the auth forms.
 *
 * @returns - A JSX.Element representing the auth form header.
 */
const Header = ({ ...props }: HeaderProps): JSX.Element => {
  return (
    <View {...props}>
      <Image className="h-[9vh] w-[30vh]" source={Logo} resizeMethod="resize" />
    </View>
  );
};

export default Header;
