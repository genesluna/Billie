export interface Transaction {
  description: string;
  amount: number;
  date: Date;
  category: { name: string; icon: string };
  userId: string;
}
