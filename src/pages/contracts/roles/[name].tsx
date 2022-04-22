import dynamic from 'next/dynamic';

const DynamicRoles = dynamic(() => import('../../../components/views/Role'), { ssr: false });

const ContractRoles = () => <DynamicRoles />;

export default ContractRoles;
