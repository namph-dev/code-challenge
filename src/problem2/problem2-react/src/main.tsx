import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/style/globals.css";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ErrorHandler } from "@/lib/utils.ts";
import { Toaster } from "@/components/ui/sonner";

export const queryClientGlobal = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const customHandlerError = query?.meta?.customHandlerError;
      ErrorHandler(error, customHandlerError);

      return error;
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClientGlobal}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
