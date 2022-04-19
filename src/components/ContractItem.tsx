import Link from 'next/link';
import { IContract } from '../types/contracts';

const ContractItem = ({ item }: { item: IContract }) => (
  <Link href={`/contracts/${item.name}/events`} passHref>
    <div className="rounded-lg p-5 align-middle justify-items-start hover:bg-green-300 shadow-sm bg-green-100 hover:opacity-80 dark:bg-green-400">
      <div className="rounded-lg p-.5 align-middle justify-items-center text-center">{item.name}</div>
    </div>
  </Link>
);

export default ContractItem;
