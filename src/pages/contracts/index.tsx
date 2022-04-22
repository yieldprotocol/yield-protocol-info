import dynamic from 'next/dynamic';

const DynamicContracts = dynamic(() => import('../../components/views/Contracts'), { ssr: false });

const Contracts = () => <DynamicContracts />;

export default Contracts;
