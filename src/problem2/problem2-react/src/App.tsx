import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { CurrencyCombobox } from "./components/currency-combobox";
import CurrencyInput from "./components/currency-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { CURRENCY_FORM_FIELD } from "./constants/currency-form.constant";
import useCurrencySwap from "./hooks/currency-swap.hook";
import ErrorPage from "./components/error-page";

export default function App() {
  const {
    form,
    queryCurrencies,
    swapCurrencyPreview,
    confirmSwapCurrency,
    onSubmit,
    changeAmount,
  } = useCurrencySwap();

  const { data: currencies = [], isError } = queryCurrencies;

  if (isError) return <ErrorPage />;

  if (currencies?.length < 2) return null;

  return (
    <main className="h-dvh w-dvw flex flex-col justify-center items-center p-10">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Currency Swap</CardTitle>
          <CardDescription>Please fill in transaction details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="Amount to send"
                  name={CURRENCY_FORM_FIELD.SEND_AMOUNT}
                  updateFieldName={CURRENCY_FORM_FIELD.RECEIVE_AMOUNT}
                  changeAmount={changeAmount}
                  isPending={swapCurrencyPreview.isPending}
                />
                <CurrencyCombobox
                  name={CURRENCY_FORM_FIELD.SEND_CURRENCY}
                  currencies={currencies}
                  defaultSelectvalue={currencies.at(0)?.currency}
                  onSelect={(currency) => {
                    form.setValue(CURRENCY_FORM_FIELD.SEND_CURRENCY, {
                      label: currency.currency,
                      price: currency.price,
                    });
                    changeAmount({
                      focusedFieldName: CURRENCY_FORM_FIELD.SEND_AMOUNT,
                      focusedFieldValue: form.getValues(
                        CURRENCY_FORM_FIELD.SEND_AMOUNT
                      ),
                      updateFieldName: CURRENCY_FORM_FIELD.RECEIVE_AMOUNT,
                    });
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                  label="Amount to receive"
                  name={CURRENCY_FORM_FIELD.RECEIVE_AMOUNT}
                  updateFieldName={CURRENCY_FORM_FIELD.SEND_AMOUNT}
                  changeAmount={changeAmount}
                  isPending={swapCurrencyPreview.isPending}
                />
                <CurrencyCombobox
                  name={CURRENCY_FORM_FIELD.RECEIVE_CURRENCY}
                  currencies={currencies}
                  defaultSelectvalue={currencies.at(1)?.currency}
                  onSelect={(currency) => {
                    form.setValue(CURRENCY_FORM_FIELD.RECEIVE_CURRENCY, {
                      label: currency.currency,
                      price: currency.price,
                    });
                    changeAmount({
                      focusedFieldName: CURRENCY_FORM_FIELD.RECEIVE_AMOUNT,
                      focusedFieldValue: form.getValues(
                        CURRENCY_FORM_FIELD.RECEIVE_AMOUNT
                      ),
                      updateFieldName: CURRENCY_FORM_FIELD.SEND_AMOUNT,
                    });
                  }}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={swapCurrencyPreview.isPending}
                isLoading={confirmSwapCurrency.isPending}
              >
                Confirm Swap
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
