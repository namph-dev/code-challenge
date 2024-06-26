import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ErrorHandler(error: unknown, customHandler?: unknown) {
  if (typeof customHandler === "function") customHandler(error);

  if (!isAxiosError(error)) {
    console.error("An unexpected error:", error);
    return;
  }

  console.error("AxiosErr:", error);
}
