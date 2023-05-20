import { sumAmountsByCategory } from "../../utils/transactionsUtils";
import { useTransactions } from "../../context/TransactionsContext";
import Container from "../../components/common/Container";
import Text from "../../components/common/Text";

const Reports = () => {
  const { transactions } = useTransactions();

  let amountSum = sumAmountsByCategory(transactions);

  console.log(amountSum);

  return (
    <Container>
      <Text size="h2">Resumo</Text>
    </Container>
  );
};

export default Reports;
