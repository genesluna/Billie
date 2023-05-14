/**
 * Formats a phone number string into a Brazilian phone number format.
 *
 * @param {string} value - The phone number string to be formatted.
 * @returns {string} The formatted phone number string.
 * The format will be "(XX) X XXXX-XXXX", where X is a digit from the input value.
 * Any non-numeric character in the input value will be removed before formatting.
 */
export function maskPhone(value: string) {
  // Remove any non-numeric characters from the string.
  value = value.replace(/\D/g, "");
  // Add parentheses around the first two digits and a space after the second digit.
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  // Add a hyphen between the fourth and fifth digits.
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  // Return the formatted phone number.
  return value;
}

/**
 * This function formats a given string value to the Brazilian CPF format.
 *
 * @param value - The string value to be formatted.
 * @returns A string representing the given value in the CPF format (###.###.###-##).
 */
export function maskCPF(value: string) {
  // Remove any non-numeric characters from the string.
  value = value.replace(/\D/g, "");
  // Add a dot after the third digit and after the sixth digit.
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  // Add a hyphen between the ninth and tenth digits.
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  // Return the formatted CPF.
  return value;
}

/**
 * This function takes a string value and returns it with a CNPJ format.
 *
 * @param value - The input string to be formatted as CNPJ.
 * @returns The formatted CNPJ string with dots, slashes, and hyphens.
 */
export function maskCNPJ(value: string) {
  // Remove any non-numeric characters from the string.
  value = value.replace(/\D/g, "");
  // Add a dot after the second digit and a dot after the fifth digit, and a slash after the eighth digit.
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  // Add a hyphen between the twelfth and thirteenth digits.
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  // Return the formatted CNPJ.
  return value;
}

/**
 * This function receives a string value and returns it with a currency format.
 *
 * @param value The string value to be formatted.
 * @returns The formatted currency value with a comma as the decimal separator and dots every three digits before the comma.
 */
export function maskCurrency(value: string) {
  // Remove any non-numeric characters from the string.
  value = value.replace(/\D/g, "");
  // Add a comma between the second to last and last digits.
  value = value.replace(/(\d)(\d{2})$/, "$1,$2");
  // Add a dot every three digits before the comma.
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
  // Add the 'R$' symbol before the formatted currency.
  return value;
}

/**
 *
 * This function receives a string value and returns it formatted as a currency in US format.
 * @param value The input string value to be formatted.
 * @returns A string with the currency value formatted in US format.
 */
export function maskCurrencyUS(value: string): string {
  // Remove any non-numeric characters from the string.
  value = value.replace(/\D/g, "");
  // Add a period between the second to last and last digits.
  value = value.replace(/(\d)(\d{2})$/, "$1.$2");
  // Add a comma every three digits before the period.
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ",");
  // Return the formatted currency.
  return value;
}

/**
 * Receives a string value and returns only its numeric characters.
 *
 * @param value - The string value to extract only the numeric characters from.
 * @returns The remaining numeric characters in the string.
 */
export function onlyNumbers(value: string) {
  // Remove any non-numeric characters from the string.
  value = value.replace(/[^\d]*/g, "");
  // Return the remaining numeric characters.
  return value;
}

/**
 * This function receives a string value and returns only its numeric characters with a period added between the second to last and last digits.
 *
 * @param value - The string value to be formatted
 * @returns A string containing only the numeric characters with a period added between the second to last and last digits.
 */
export function onlyNumbersWithDecimal(value: string) {
  // Remove any non-numeric characters from the string.
  value = value.replace(/[^\d]*/g, "");
  // Add a period between the second to last and last digits.
  value = value.replace(/(\d)(\d{2})$/, "$1.$2");
  return value;
}
