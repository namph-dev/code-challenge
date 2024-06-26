import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";

import React from "react";
import { FormSchema } from "@/schemas/currency.schema";
import { DebouncedState } from "use-debounce";
import { ChangeAmountParams, InputFormField } from "@/types/currency";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { CURRENCY_FORM_FIELD } from "@/constants/currency-form.constant";

type Props = {
  label: string;
  name: InputFormField;
  updateFieldName: InputFormField;
  changeAmount: DebouncedState<(params: ChangeAmountParams) => Promise<void>>;
  isPending: boolean;
};

export default function CurrencyInput({
  label,
  name,
  updateFieldName,
  isPending,
  changeAmount,
}: Props) {
  const form = useFormContext<z.infer<typeof FormSchema>>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              changeAmount({
                event,
                updateFieldName,
              })
            }
            onFocus={() =>
              form.setValue(CURRENCY_FORM_FIELD.FOCUS_FIELD, field.name)
            }
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center px-2">
                {isPending &&
                form.getValues(CURRENCY_FORM_FIELD.FOCUS_FIELD) !==
                  field.name &&
                (field.value || form.getValues(updateFieldName)) ? (
                  <Loader className="size-4 animate-spin" />
                ) : null}
              </div>
              <Input
                step="any"
                min="0"
                type="number"
                className={cn(
                  isPending &&
                    form.getValues(CURRENCY_FORM_FIELD.FOCUS_FIELD) !==
                      field.name &&
                    "text-white"
                )}
                {...field}
                value={field.value || ""}
                onKeyDown={(event) => {
                  if (event.key === "-" || event.key === "+") {
                    event.preventDefault();
                  }
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
