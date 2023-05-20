import { Transaction } from "../models/Transaction";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      login: undefined;
      register: undefined;
      emailValidation: undefined;
      forgotPassword: undefined;
      home: undefined;
      addTransaction: {
        transactionId: string | undefined;
      };
      reports: undefined;
    }
  }
}
