/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { NETWORK_LABEL } from '../config/networks';
import { updateChainId } from '../state/actions/chain';
import { useAppDispatch, useAppSelector } from '../state/hooks/general';

const NetworkModal = () => {
  const dispatch = useAppDispatch();
  const chainId = useAppSelector((st) => st.chain.chainId);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClick = (id: number) => {
    dispatch(updateChainId(id));
  };

  return (
    <>
      <div>
        {chainId && (
          <button
            type="button"
            onClick={() => setShowModal(!showModal)}
            className="text-gray-900 hover:bg-green-500 bg-green-300  flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-green-800 focus-visible:ring-offset-green-900 transition dark:text-gray-900 dark:hover:bg-green-500  text-md leading-5 rounded-lg px-3 py-2"
          >
            {NETWORK_LABEL[chainId]}
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
              <div className="border-1 rounded-lg shadow-lg relative flex flex-col w-full dark:bg-gray-900 bg-white outline-none focus:outline-none">
                <div className="flex justify-between items-center pl-8 py-4 pr-6 border-b dark:border-gray-800">
                  <div className="text-lg leading-6 font-medium dark:text-white">Choose Network</div>
                  <div className="relative p-6">
                    <div className="my-4 text-gray-900 text-lg leading-relaxed">
                      {[...Object.keys(NETWORK_LABEL)].map((id: any) => (
                        <button
                          key={id}
                          className="mx-2 my-2 w-full text-gray-900 hover:bg-green-500 bg-green-300  flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-green-800 focus-visible:ring-offset-green-900 transition dark:text-white dark:hover:bg-green-500 text-md leading-5 rounded-lg px-3 py-2"
                          onClick={(e) => handleClick(id)}
                          type="button"
                        >
                          <div className="text-sm">{NETWORK_LABEL[id]}</div>
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
