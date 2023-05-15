import { TextInput } from "react-native";
import React, { forwardRef, useState } from "react";
import Input, { InputProps } from "./Input";
import { styled } from "nativewind";

import {
  maskPhone,
  maskCurrency,
  maskCPF,
  maskCNPJ,
  onlyNumbers,
  onlyNumbersWithDecimal,
} from "../../utils/textInputMasks";

type MaskedInputProps = InputProps & {
  mask: "PHONE" | "CURRENCY" | "CPF" | "CNPJ";
  onChangeMask?: (text: string) => void;
  onChangeUnmasked?: (text: string) => void;
};

/**
 *
 * A masked input component.
 *
 * @param mask - The type of mask to be applied to the input.
 * @param onChangeMask - Callback function called when the masked value changes.
 * @param onChangeUnmasked - Callback function called when the unmasked value changes.
 *
 * @returns - A styled Input component with the specified mask applied.
 */
const MaskedInput = forwardRef<TextInput, MaskedInputProps>(
  ({ mask, onChangeMask, onChangeUnmasked, ...props }: MaskedInputProps, ref): JSX.Element => {
    const [text, setText] = useState<string>("");
    let maxLength: number = mask === "PHONE" ? 15 : mask === "CPF" ? 14 : mask === "CNPJ" ? 18 : 16;

    function handleChange(text: string) {
      switch (mask) {
        case "PHONE":
          setMask(maskPhone(text));
          break;
        case "CPF":
          setMask(maskCPF(text));
          break;
        case "CNPJ":
          setMask(maskCNPJ(text));
          break;
        default:
          setMask(maskCurrency(text));
          break;
      }

      function setMask(maskedValue: string) {
        onChangeUnmasked?.(mask !== "CURRENCY" ? onlyNumbers(maskedValue) : onlyNumbersWithDecimal(maskedValue));
        onChangeMask?.(maskedValue);
        setText(maskedValue);
      }
    }

    return (
      <Input
        onChangeText={(text: string) => handleChange(text)}
        value={text}
        maxLength={maxLength}
        ref={ref}
        {...props}
      />
    );
  }
);

export default styled(MaskedInput, {
  props: {
    inputStyle: true,
  },
});
