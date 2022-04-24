/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CHAIN_INFO, SUPPORTED_CHAIN_IDS } from '../config/chainData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { updateChainId } from '../state/actions/application';
import { useAppDispatch, useAppSelector } from '../state/hooks/general';
import { CHAIN_ID_LOCAL_STORAGE } from '../utils/constants';

const NetworkModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { chainId } = useAppSelector(({ application }) => application);
  const [cachedChainId, setCachedChainId] = useLocalStorage(CHAIN_ID_LOCAL_STORAGE, chainId.toString());
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChainIdChange = (id: number) => {
    setCachedChainId(id.toString()); // set chain id in local storage
    dispatch(updateChainId(id)); // set chain id in redux

    // push to a new url with the updated chain id as a query param
    const url = { pathname: router.asPath.split('?')[0], query: { chainId: id } };
    router.push(url);
  };

  return (
    <>
      <div>
        {cachedChainId && (
          <button
            type="button"
            onClick={() => setShowModal(!showModal)}
            className="text-gray-900 hover:bg-green-500 bg-green-300  flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-green-800 focus-visible:ring-offset-green-900 transition dark:text-gray-900 dark:hover:bg-green-500  text-md leading-5 rounded-lg px-3 py-2"
          >
            {CHAIN_INFO.get(+cachedChainId)?.name}
          </button>
        )}
      </div>
      {showModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-opacity-75 transition-opacity bg-gray-500"
            onClick={() => setShowModal(false)}
          >
            <div className="relative my-6 mx-auto max-w-3xl w-1/3">
              <div className="border-1 rounded-lg shadow-lg relative flex flex-col w-full dark:bg-gray-800 bg-white outline-none focus:outline-none">
                <div className="flex justify-between items-center pl-8 py-4 pr-6 border-b dark:border-gray-800">
                  <div className="text-lg leading-6 font-medium dark:text-white">Choose Network</div>
                  <div className="relative p-6">
                    <div className="my-4 text-gray-900 text-lg leading-relaxed">
                      {SUPPORTED_CHAIN_IDS.map((id) => (
                        <button
                          key={id}
                          className="my-2 w-full text-gray-900 hover:bg-green-500 bg-green-300 items-center justify-center overflow-hidden font-medium focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-green-800 focus-visible:ring-offset-green-900 transition dark:hover:bg-green-500 text-md rounded-lg py-2"
                          onClick={() => handleChainIdChange(id)}
                          type="button"
                        >
                          <div className="text-sm">{CHAIN_INFO.get(id)?.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black"> </div>
        </>
      )}
    </>
  );
};

export default NetworkModal;
