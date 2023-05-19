import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Keyboard, View, ViewProps, Modal, TextInput } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";

import { Category } from "../../../models/Category";
import MaskedInput from "../../common/MaskedInput";
import { formatDate } from "../../../utils/utils";
import CategoriesList from "../../CategoriesList";
import Button from "../../common/Button";
import colors from "../../../../colors";
import Input from "../../common/Input";
import { Transaction } from "../../../models/Transaction";
import { useAuth } from "../../../context/AuthContext";

type AddTransactionFormProps = ViewProps & {
  onSubmit: (trasaction: Transaction) => Promise<void>;
};

export type AddTransactionFormValues = {
  description: string;
  amount: string;
  categoryName: string;
  date: string;
};

/**
 * A form for registering a new transaction.
 *
 * @param onSubmit - A callback function to be called when the form is submitted.
 *
 * @returns - A component that contains the register form.
 */
const AddTransactionForm = ({ onSubmit, ...props }: AddTransactionFormProps) => {
  const { authUser } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [showCategoriesModal, setShowCategoriesModal] = useState<boolean>(false);

  const amountInput = useRef<TextInput>(null);
  const categoryInput = useRef<TextInput>(null);
  const dateInput = useRef<TextInput>(null);

  const initialValues: AddTransactionFormValues = {
    description: "",
    amount: "",
    categoryName: "",
    date: "",
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
      await onSubmit({
        description: values.description,
        amount: parseFloat(values.amount),
        type: type,
        category: category!,
        date: date!,
        userId: authUser?.uid!,
      });
    },
    validateOnChange: true,
  });

  function handleCategorySelection(category: Category) {
    setCategory(category);
    values.categoryName = category.name;
    handleChange("categoryName");
    categoryInput.current?.blur();
  }

  function handleDateSelection() {
    DateTimePickerAndroid.open({
      value: date ?? new Date(),
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
          icon="corner-left-up"
          className={`w-1/2 border ${
            type === "expense"
              ? "bg-primary border-primary-border dark:bg-base-400 dark:border-primary-focus"
              : "bg-primary-focus border-primary-focus dark:bg-base-550 dark:border-base-550"
          }`}
          activeOpacity={1}
          onPress={() => {
            setType("expense");
          }}
          label="Despesa"
        />
        <Button
          icon="corner-right-down"
          className={`w-1/2 border ${
            type === "income"
              ? "bg-primary border-primary-border dark:bg-base-400 dark:border-primary-focus"
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
        onChangeUnmasked={handleChange("amount")}
        onBlur={handleBlur("amount")}
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
        placeholder="Escolha a data"
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
        icon="save"
        label="salvar"
        onPress={() => handleSubmit()}
        isLoading={isSubmitting}
      />

      <Modal animationType="slide" visible={showCategoriesModal}>
        <CategoriesList
          category={category}
          onCategorySelected={handleCategorySelection}
          onClose={() => {
            setShowCategoriesModal(false);
          }}
        />
      </Modal>

      {/* KeyboardAvoidingView fix */}
      <View className="flex-1" />
    </View>
  );
};

export default AddTransactionForm;
