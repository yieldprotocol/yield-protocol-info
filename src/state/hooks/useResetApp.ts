import { useEffect } from 'react';
import { reset as resetChain } from '../actions/chain';
import { reset as resetContracts } from '../actions/contracts';
import { reset as resetVaults } from '../actions/vaults';
import { useAppDispatch, useAppSelector } from './general';

const useResetApp = () => {
  const dispatch = useAppDispatch();
  const { version } = useAppSelector(({ application }) => application);
  const { chainId } = useAppSelector(({ chain }) => chain);

  useEffect(() => {
    if (process.env.REACT_APP_VERSION !== version) {
      dispatch(resetChain());
      dispatch(resetContracts());
      dispatch(resetVaults());
    }
  }, [version, dispatch]);

  useEffect(() => {
    dispatch(resetContracts());
    dispatch(resetVaults());
  }, [chainId, dispatch]);
};

export default useResetApp;
