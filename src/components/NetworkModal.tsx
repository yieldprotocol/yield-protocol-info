import React from 'react';
import { NETWORK_LABEL } from '../config/networks';
import { updateChainId } from '../state/actions/chain';
import { useAppDispatch } from '../state/hooks/general';

const NetworkModal = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      {[...Object.keys(NETWORK_LABEL)].map((chainId: any) => (
        <button
          className="text-gray-50 hover:text-white flex items-center flex-col gap-2 justify-start"
          key={chainId}
          onClick={() => dispatch(updateChainId(chainId))}
          type="button"
        >
          <div className="text-sm">{NETWORK_LABEL[chainId]}</div>
        </button>
      ))}
    </div>
  );
};

export default NetworkModal;
