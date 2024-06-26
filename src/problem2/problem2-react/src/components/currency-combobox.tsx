import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormSchema } from "@/schemas/currency.schema";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { ComboboxFormField, Currency } from "@/types/currency";

type props = {
  name: ComboboxFormField;
  currencies: Currency[];
  defaultSelectvalue: string | undefined;
  onSelect: (currency: Currency) => void;
};

export function CurrencyCombobox({
  name,
  currencies,
  defaultSelectvalue,
  onSelect,
}: props) {
  const form = useFormContext<z.infer<typeof FormSchema>>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="invisible">Currency</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {field.value.label
                    ? currencies.find(
                        (currency) => currency.currency === field.value.label
                      )?.currency
                    : defaultSelectvalue || "Select currency"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" side="right">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup className="max-h-[400px] overflow-y-auto">
                  {currencies.map((currency) => (
                    <CommandItem
                      value={`${currency.currency}_${currency.price}`}
                      key={`${currency.currency}_${currency.price}`}
                      onSelect={() => onSelect(currency)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          `${currency.currency}_${currency.price}` ===
                            `${field.value.label}_${field.value.price}`
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {currency.currency}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
