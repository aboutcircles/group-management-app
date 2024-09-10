import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface TransactionToastProps {
  transactionHash: string;
}

const TransactionToast: React.FC<TransactionToastProps> = ({
  transactionHash,
}) => (
  <Link
    className="flex text-sm text-primary items-center"
    href={`https://gnosis.blockscout.com/tx/${transactionHash}`}
    target="_blank"
  >
    Transaction completed! View it here
    <ArrowRightStartOnRectangleIcon width={15} height={15} className="ml-1" />
  </Link>
);

export default TransactionToast;
