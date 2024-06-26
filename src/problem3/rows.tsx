import { Price, WalletBalance } from "./type";
import React from "react";


const Rows = ({
  sortedBalances,
  prices,
}: {
  sortedBalances: WalletBalance[];
  prices: Price[];
}) => {
  return (
    <>
      {sortedBalances.map(({ balance, index }) => {
        const { amount } = balance;

        const usdValue = prices?.[balance.currency] * amount;
        const formattedAmount =
          typeof amount !== "number"
            ? parseFloat(amount).toFixed()
            : amount.toFixed();

        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={amount}
            usdValue={usdValue}
            formattedAmount={formattedAmount}
          />
        );
      })}
    </>
  );
};

export default Rows;
