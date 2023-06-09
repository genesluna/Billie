export interface Transaction {
  Id?: string;
  description: string;
  type: "income" | "expense" | string;
  photoURL?: string;
  amount: number;
  date: Date;
  category: { name: string; icon: string };
}
