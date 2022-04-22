import dynamic from 'next/dynamic';

const DynamicLiquidations = dynamic(() => import('../../components/views/Liquidations'), { ssr: false });

const LiquidationsPage = () => <DynamicLiquidations />;

export default LiquidationsPage;
