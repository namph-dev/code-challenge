import { CURRENCY_FORM_FIELD } from "@/constants/currency-form.constant";
import { ErrorHandler } from "@/lib/utils";
import { FormSchema } from "@/schemas/currency.schema";
import { currencyService } from "@/services/currency.service";
import { ChangeAmountParams, SwapCurrencyParams } from "@/types/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";

export default function useCurrencySwap() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      send: 0,
      receive: 0,
      sendCurrency: {},
      receiveCurrency: {},
    },
  });

  const queryCurrencies = useQuery({
    queryKey: ["currencies"],
    queryFn: currencyService.getCurrencyPrices,
    meta: {
      customHandlerError: () =>
        toast.error("Unexpected error! Please try again."),
    },
  });

  const swapCurrencyPreview = useMutation({
    mutationFn: (swapcurrencyParams: SwapCurrencyParams) =>
      currencyService.swapCurrencyPreview(swapcurrencyParams),

    onSuccess: (data) => {
      if (
        data.field === CURRENCY_FORM_FIELD.SEND_AMOUNT ||
        data.field === CURRENCY_FORM_FIELD.RECEIVE_AMOUNT
      )
        form.setValue(data.field, data.value);
    },
    onError: (err) =>
      ErrorHandler(err, () =>
        toast.error("Unexpected error! Please try again.")
      ),
  });

  const confirmSwapCurrency = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) =>
      currencyService.confirmSwapCurrency(data),

    onSuccess: () => {
      form.resetField(CURRENCY_FORM_FIELD.SEND_AMOUNT);
      form.resetField(CURRENCY_FORM_FIELD.RECEIVE_AMOUNT);
      toast.success("Transaction successfully");
    },
    onError: (err) =>
      ErrorHandler(err, () =>
        toast.error("Unexpected error! Please try again.")
      ),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    confirmSwapCurrency.mutate(data);
  }

  const changeAmount = useDebouncedCallback(
    async (params: ChangeAmountParams) => {
      let typedFieldName;
      let typedFieldValue;

      if ("event" in params) {
        typedFieldName = params.event.target.name;
        typedFieldValue = parseFloat(params.event.target.value);

        if (
          typedFieldName !== CURRENCY_FORM_FIELD.SEND_AMOUNT &&
          typedFieldName !== CURRENCY_FORM_FIELD.RECEIVE_AMOUNT
        )
          return;

        form.setValue(typedFieldName, typedFieldValue);
      } else if ("focusedFieldName" in params) {
        typedFieldName = params.focusedFieldName;
        typedFieldValue = params.focusedFieldValue;

        if (!typedFieldValue) return;

        form.setValue(CURRENCY_FORM_FIELD.FOCUS_FIELD, typedFieldName);
      } else {
        return;
      }

      const sendCurrency = form.getValues(CURRENCY_FORM_FIELD.SEND_CURRENCY);
      const receiveCurrency = form.getValues(
        CURRENCY_FORM_FIELD.RECEIVE_CURRENCY
      );

      const sendCurrencyId = `${sendCurrency.label}_${sendCurrency.price}`;
      const receiveCurrencyId = `${receiveCurrency.label}_${receiveCurrency.price}`;

      swapCurrencyPreview.mutate({
        typedFieldName,
        typedFieldValue,
        sendCurrencyId,
        receiveCurrencyId,
        updateFieldName: params.updateFieldName,
      });
    },
    300
  );

  useEffect(() => {
    if (queryCurrencies.isLoading) return;

    const first = queryCurrencies.data?.at(0);
    const second = queryCurrencies.data?.at(1);
    if (first && second) {
      form.setValue(
        CURRENCY_FORM_FIELD.SEND_CURRENCY,
        {
          label: first.currency,
          price: first.price,
        },
        { shouldDirty: true }
      );
      form.setValue(
        CURRENCY_FORM_FIELD.RECEIVE_CURRENCY,
        {
          label: second.currency,
          price: second.price,
        },
        { shouldDirty: true }
      );
    }
  }, [queryCurrencies.data, form, queryCurrencies.isLoading]);

  return {
    form,
    queryCurrencies,
    swapCurrencyPreview,
    confirmSwapCurrency,
    changeAmount,
    onSubmit,
  };
}
