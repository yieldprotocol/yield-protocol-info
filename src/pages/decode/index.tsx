import dynamic from 'next/dynamic';

const DynamicGovernance = dynamic(() => import('../../components/views/Governance'), { ssr: false });

const Decode = () => <DynamicGovernance />;

export default Decode;
