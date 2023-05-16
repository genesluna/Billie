export interface Transaction {
  description: string;
  type: "income" | "expense" | string;
  amount: number;
  date: Date;
  category: { name: string; icon: string };
  userId: string;
}
