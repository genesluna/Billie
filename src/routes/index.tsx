import { NavigationContainer } from "@react-navigation/native";

import { TransactionsProvider } from "../context/TransactionsContext";
import { useAuth } from "../context/AuthContext";
import { UserRoutes } from "./user.routes";
import { AuthRoutes } from "./auth.routes";

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
