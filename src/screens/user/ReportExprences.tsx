import { VictoryPie, VictoryTooltip } from "victory-native";
import { ScrollView, View } from "react-native";
import { useState } from "react";

import { sumAmountsAndGetPercentageOfTotalByCategory } from "../../utils/transactionsUtils";
import TransactionsMonthSelector from "../../components/TransactionsMonthSelector";
import TransactionsListEmpty from "../../components/TransactionsListEmpty";
import { useTransactions } from "../../context/TransactionsContext";
import Container from "../../components/common/Container";
import ReportCard from "../../components/ReportCard";

const ReportExprences = () => {
  const [selected, setSelected] = useState("");
  const { transactions, oldestTransactionDate } = useTransactions();

  const categories = sumAmountsAndGetPercentageOfTotalByCategory(transactions)
    .filter((c) => c.type === "expense")
    .sort((a, b) => b.totalPercentage! - a.totalPercentage!);

  function handleCardOnPress(name: string) {
    setSelected((prev) => (prev === name ? "" : name));
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}>
      <Container className="px-2 justify-start">
        {(categories[0] || oldestTransactionDate) && <TransactionsMonthSelector key={0} className="mt-4" />}
        {categories[0] && (
          <VictoryPie
            key={1}
            data={categories}
            x="name"
            y="totalPercentage"
            innerRadius={70}
            animate={{
              onLoad: { duration: 2000 },
              duration: 2000,
              easing: "circle",
            }}
            radius={({ datum }) => (datum.name === selected || selected === "" ? 140 : 130)}
            colorScale={categories.map((category) => category.color!)}
            style={{
              parent: {
                marginTop: -30,
                marginBottom: -10,
              },
              labels: {
                fontSize: 14,
              },
              data: {
                fillOpacity: ({ datum }) => (datum.name === selected || selected === "" ? 1 : 0.3),
                stroke: ({ datum }) => (datum.name === selected ? datum.color : "none"),
              },
            }}
            labelComponent={
              <VictoryTooltip
                renderInPortal={false}
                flyoutPadding={10}
                orientation={"top"}
                flyoutStyle={{
                  stroke: 0,
                }}
              />
            }
          />
        )}

        <View key={2} className="px-2">
          {categories.map((item) => (
            <ReportCard
              key={item.name}
              className={`${selected === item.name ? "bg-primary-faded dark:bg-primary-faded shadow-transparent" : ""}`}
              category={item}
              onLongPress={() => handleCardOnPress(item.name)}
            />
          ))}
        </View>
        {!categories[0] && <TransactionsListEmpty />}
      </Container>
    </ScrollView>
  );
};

export default ReportExprences;
