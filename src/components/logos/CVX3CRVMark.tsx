import CRVMark from './CRVMark';
import CVXMark from './CVXMark';

const CVX3CRVMark = () => (
  <div className="relative">
    <CVXMark />
    <div className="absolute">
      <div className="relative -top-6 -left-2">
        <CRVMark />
        <span className="absolute top-1 left-1 text-xs font-black">3</span>
      </div>
    </div>
  </div>
);

export default CVX3CRVMark;
