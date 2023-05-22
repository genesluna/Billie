import { Keyboard, View, ViewProps, Modal, TextInput, Pressable } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Feather as Icon } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { maskCurrency, onlyNumbersWithDecimal } from "../../../utils/textInputMasks";
import { formatDate, getTransactionById } from "../../../utils/transactionsUtils";
import { useTransactions } from "../../../context/TransactionsContext";
import { Transaction } from "../../../models/Transaction";
import { Category } from "../../../models/Category";
import MaskedInput from "../../common/MaskedInput";
import CategoriesList from "../../CategoriesList";
import Button from "../../common/Button";
import colors from "../../../../colors";
import Input from "../../common/Input";

type AddTransactionFormProps = ViewProps & {
  onAddTransaction: (trasaction: Transaction) => Promise<void>;
  onUpdateTransaction: (trasaction: Transaction) => Promise<void>;
};

type ParamsProps = {
  transactionId: string | undefined;
};

type AddTransactionFormValues = {
  description: string;
  amount: string;
  categoryName: string;
  date: string;
};

/**
 * A form for registering a new transaction.
 *
 * @param onAddTrasaction - A callback function to be called when the form is submitted with a new transaction.
 * @param onUpdateTrasaction - A callback function to be called when the form is submitted with a transaction to be updated.
 *
 * @returns - A component that contains the register form.
 */
const AddTransactionForm = ({ onAddTransaction, onUpdateTransaction, ...props }: AddTransactionFormProps) => {
  const route = useRoute();
  const transactionId = (route.params as ParamsProps)?.transactionId ?? undefined;
  const { transactions } = useTransactions();
  const transaction = getTransactionById(transactions, transactionId ?? "");

  const [date, setDate] = useState<Date | undefined>(transaction?.date ?? undefined);
  const [type, setType] = useState<"income" | "expense" | string>(transaction?.type ?? "expense");
  const [category, setCategory] = useState<Category | undefined>(transaction?.category ?? undefined);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);

  const amountInput = useRef<TextInput>(null);
  const categoryInput = useRef<TextInput>(null);
  const dateInput = useRef<TextInput>(null);

  const initialValues: AddTransactionFormValues = {
    description: transaction?.description ?? "",
    amount: maskCurrency(transaction?.amount.toFixed(2) ?? ""),
    categoryName: transaction?.category.name ?? "",
    date: transaction?.date.toString() ?? "",
  };

  const addTtansactionSchema = Yup.object().shape({
    description: Yup.string().required("A descrição é obrigatória"),
    amount: Yup.string().required("O valor é obrigatório"),
    categoryName: Yup.string().required("A cagoria é obrigatória"),
    date: Yup.string().required("A data é obrigatória"),
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched, isSubmitting } = useFormik({
    validationSchema: addTtansactionSchema,
    initialValues: initialValues,
    onSubmit: async (values) => {
      if (transactionId) {
        await onUpdateTransaction({
          Id: transactionId,
          description: values.description,
          amount: onlyNumbersWithDecimal(values.amount),
          type: type,
          category: category!,
          date: date!,
        });
      } else {
        await onAddTransaction({
          description: values.description,
          amount: onlyNumbersWithDecimal(values.amount),
          type: type,
          category: category!,
          date: date!,
        });
      }
    },
  });

  function handleCategorySelection(category: Category) {
    setCategory(category);
    values.categoryName = category.name;
    handleChange("categoryName");
    categoryInput.current?.blur();
  }

  function handleDateSelection() {
    const now = new Date();
    DateTimePickerAndroid.open({
      value: date ?? now,
      minimumDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      maximumDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      onChange: (e, selectedDate) => {
        setDate(selectedDate);
        values.date = formatDate(selectedDate!);
        handleChange("date");
        dateInput.current?.blur();
      },

      mode: "date",
    });
  }

  return (
    <View className="items-center justify-end flex-1 w-full px-6 mt-6 mb-4" {...props}>
      <View className="justify-center p-8 my-10 rounded-full bg-primary dark:bg-base-450">
        <Icon name="dollar-sign" size={50} color={colors.content[100]} />
      </View>

      <View className="flex-row w-full mt-4 mb-3">
        <Button
          icon="arrow-down-circle"
          className={`w-1/2 border-b-[3px] border-t-[3px] dark:border-b-2 dark:border-t-2 ${
            type === "expense"
              ? "bg-primary border-b-content-100 border-t-primary dark:bg-base-400 dark:border-primary-focus dark:border-t-base-400"
              : "bg-primary-focus border-primary-focus dark:bg-base-550 dark:border-base-550"
          }`}
          activeOpacity={1}
          onPress={() => {
            setType("expense");
          }}
          label="Despesa"
        />
        <Button
          icon="arrow-up-circle"
          className={`w-1/2 border-b-[3px] border-t-[3px] dark:border-b-2 dark:border-t-2 ${
            type === "income"
              ? "bg-primary border-b-content-100 border-t-primary dark:bg-base-400 dark:border-primary-focus dark:border-t-base-400"
              : "bg-primary-focus border-primary-focus dark:bg-base-550 dark:border-base-550"
          }`}
          activeOpacity={1}
          label="Receita"
          onPress={() => {
            setType("income");
          }}
        />
      </View>

      <Input
        icon="align-left"
        placeholder="Digite a descrição"
        keyboardAppearance="dark"
        autoCapitalize="sentences"
        returnKeyType="next"
        onChangeText={handleChange("description")}
        onBlur={handleBlur("description")}
        value={values.description}
        error={errors.description}
        touched={touched.description}
        onSubmitEditing={() => amountInput.current?.focus()}
      />

      <MaskedInput
        ref={amountInput}
        icon="dollar-sign"
        placeholder="Digite o valor"
        mask="CURRENCY"
        returnKeyType="next"
        keyboardType="number-pad"
        keyboardAppearance="dark"
        onChangeMask={handleChange("amount")}
        onBlur={handleBlur("amount")}
        value={values.amount}
        error={errors.amount}
        touched={touched.amount}
      />

      <Input
        ref={categoryInput}
        icon="bookmark"
        placeholder="Escolha a categoria"
        showSoftInputOnFocus={false}
        onPressIn={() => {
          Keyboard.dismiss();
          setShowCategoriesModal(true);
        }}
        value={category?.name}
        onBlur={handleBlur("categoryName")}
        cursorColor={colors.base[400]}
        error={errors.categoryName}
        touched={touched.categoryName}
      />

      <Input
        ref={dateInput}
        icon="calendar"
        placeholder="Informe a data"
        showSoftInputOnFocus={false}
        onPressIn={() => {
          Keyboard.dismiss();
          handleDateSelection();
        }}
        value={date ? formatDate(date) : ""}
        cursorColor={colors.base[400]}
        onBlur={handleBlur("date")}
        error={errors.date}
        touched={touched.date}
      />

      <Button
        className="w-full mt-1"
        icon={transactionId ? "refresh-cw" : "save"}
        label={transactionId ? "atualizar" : "salvar"}
        onPress={() => handleSubmit()}
        isLoading={isSubmitting}
      />

      <Modal animationType="fade" visible={showCategoriesModal} transparent>
        <Pressable
          className="items-center justify-center flex-1 bg-content-400/60"
          onPress={() => setShowCategoriesModal(false)}
        >
          <CategoriesList
            category={category}
            onCategorySelected={handleCategorySelection}
            onClose={() => {
              setShowCategoriesModal(false);
            }}
          />
        </Pressable>
      </Modal>

      {/* KeyboardAvoidingView fix */}
      <View className="flex-1" />
    </View>
  );
};

export default AddTransactionForm;
