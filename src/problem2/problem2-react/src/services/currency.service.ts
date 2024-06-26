import {
  Currency,
  SwapCurrencyParams,
  SwappedCurrency,
} from "@/types/currency";
import axiosInstance from "./axios-instance";
import { CURRENCY_FORM_FIELD } from "@/constants/currency-form.constant";
import { z } from "zod";
import { FormSchema } from "@/schemas/currency.schema";

export const currencyService = {
  getCurrencyPrices: async (): Promise<Currency[]> => {
    // throw new Error("Invalid");

    const res = await axiosInstance.get<Currency[]>("/prices.json");

    const classifications = res.data?.map(
      (currency) => `${currency.currency}_${currency.price}`
    );
    const currenciesIterator = new Set(classifications).entries();

    const uniqueCurrencies = [];
    for (const currency of currenciesIterator) {
      const currencyAndPRice = currency?.at(0)?.split("_") || ["", ""];

      const price = Number(currencyAndPRice?.at(1));

      if (!isNaN(price))
        uniqueCurrencies.push({
          currency: currencyAndPRice[0],
          price,
        });
    }

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 500)
    );

    return uniqueCurrencies;
  },

  swapCurrencyPreview: async ({
    typedFieldName,
    typedFieldValue,
    sendCurrencyId,
    receiveCurrencyId,
    updateFieldName,
  }: SwapCurrencyParams): Promise<SwappedCurrency> => {
    // throw new Error("Invalid");

    const { data } = await axiosInstance.get<Currency[]>("/prices.json");

    let priceSendCurrency = 0;
    let priceReceiveCurrency = 0;
    for (const currency of data) {
      const currencyId = `${currency.currency}_${currency.price}`;
      if (currencyId === sendCurrencyId) priceSendCurrency = currency.price;

      if (currencyId === receiveCurrencyId)
        priceReceiveCurrency = currency.price;

      if (priceSendCurrency > 0 && priceReceiveCurrency > 0) break;
    }

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 500)
    );

    if (typedFieldName === CURRENCY_FORM_FIELD.SEND_AMOUNT)
      return {
        field: updateFieldName,
        value: (priceSendCurrency / priceReceiveCurrency) * typedFieldValue,
      };

    return {
      field: updateFieldName,
      value: (priceReceiveCurrency / priceSendCurrency) * typedFieldValue,
    };
  },

  confirmSwapCurrency: async (data: z.infer<typeof FormSchema>) => {
    // throw new Error("Invalid");

    // do something with data and use post request to send to server
    console.log(data);

    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
      }, 1000)
    );
  },
};
