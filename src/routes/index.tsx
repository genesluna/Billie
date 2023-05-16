import { NavigationContainer } from "@react-navigation/native";
import { UserRoutes } from "./user.routes";

/**
 * A component that renders the appropriate set of routes based on the user's authentication status.
 *
 * @returns The appropriate rendered React component.
 */
export function Routes(): JSX.Element {
  return (
    <NavigationContainer>
      <UserRoutes />
    </NavigationContainer>
  );
}
