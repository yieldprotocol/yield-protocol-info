import dynamic from 'next/dynamic';

const DynamicContract = dynamic(() => import('../../../components/views/Contract'), { ssr: false });

const ContractEvents = () => <DynamicContract />;

export default ContractEvents;
