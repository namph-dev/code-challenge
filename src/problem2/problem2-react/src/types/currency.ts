import React from "react";

export type Currency = {
  currency: string;
  price: number;
};

export type InputFormField = "send" | "receive";
export type ComboboxFormField = "sendCurrency" | "receiveCurrency";

export type SwapCurrencyParams = {
  typedFieldName: InputFormField;
  typedFieldValue: number;
  sendCurrencyId: string;
  receiveCurrencyId: string;
  updateFieldName: string;
};

export type SwappedCurrency = {
  field: string;
  value: number;
};

export type ChangeAmountParams =
  | {
      event: React.ChangeEvent<HTMLInputElement>;
      updateFieldName: InputFormField;
    }
  | {
      focusedFieldName: InputFormField;
      focusedFieldValue: number;
      updateFieldName: InputFormField;
    };
