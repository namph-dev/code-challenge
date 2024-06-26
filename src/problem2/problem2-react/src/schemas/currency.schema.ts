import { z } from "zod";

export const FormSchema = z.object({
  send: z.coerce
    .number({
      invalid_type_error: "Number must be greater than 0",
    })
    .positive(),
  receive: z.coerce
    .number({
      invalid_type_error: "Number must be greater than 0",
    })
    .positive(),
  sendCurrency: z.object({
    label: z.string(),
    price: z.number(),
  }),
  receiveCurrency: z.object({
    label: z.string(),
    price: z.number(),
  }),
  focusField: z.string().optional(),
});
