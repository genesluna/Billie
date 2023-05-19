import { NavigationContainer } from "@react-navigation/native";

import { UserRoutes } from "./user.routes";
import { useAuth } from "../context/AuthContext";
import { AuthRoutes } from "./auth.routes";
import { TransactionsProvider } from "../context/TransactionsContext";

/**
 * A component that renders the appropriate set of routes based on the user's authentication status.
 *
 * @returns The appropriate rendered React component.
 */
export function Routes(): JSX.Element {
  const { authUser } = useAuth();

  return (
    <NavigationContainer>
      {authUser?.emailVerified ? (
        <TransactionsProvider>
          <UserRoutes />
        </TransactionsProvider>
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}
