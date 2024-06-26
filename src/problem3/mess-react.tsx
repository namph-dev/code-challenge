import { BLOCKCHAIN_TYPE, PRIORITY_DEFAULT } from "./constant";
import Rows from "./rows";
import { WalletBalance } from "./type";

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    const priority = BLOCKCHAIN_TYPE[blockchain];

    if (!priority) return PRIORITY_DEFAULT;
    return priority;

  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        if (balancePriority <= PRIORITY_DEFAULT) return false;

        if (balance.amount <= 0) return true;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        return rightPriority - leftPriority;
      });

  }, [balances, prices]);

  return (
    <div {...rest}>
      <Rows sortedBalances={sortedBalances} />
    </div>
  );
};
