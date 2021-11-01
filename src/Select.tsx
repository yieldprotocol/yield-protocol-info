import React, { useEffect, useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FiChevronDown as SelectorIcon, FiCheck as CheckIcon } from 'react-icons/fi';
import { v4 as uuid } from 'uuid';
import { markMap } from './config/marks';
import { useAppSelector } from './state/hooks/general';

const Selecty = ({ options, label, onChange }: any) => {
  const assets = useAppSelector((st) => st.chain.assets);
  const seriesMap = useAppSelector((st) => st.chain.series);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const handleChange = (val: any) => {
    setSelectedOption(val);
    onChange(val);
  };

  const selectedRender = () => (
    <div className="flex">
      <div className="mr-4">{selectedLogo && <div className="h-5 w-5">{selectedLogo}</div>}</div>
      <div className="flex">
        <span className="block truncate">{options.filter((x: any) => x[0] === selectedOption)[0][1]}</span>
      </div>
    </div>
  );

  useEffect(() => {
    const asset = label === 'Series' ? assets[seriesMap[selectedOption!]?.baseId!] : assets[selectedOption!];
    const logo = markMap?.get(asset?.symbol!);
    selectedOption && logo && setSelectedLogo(logo);
  }, [selectedOption, seriesMap, assets, label]);

  if (!options) return null;
  return (
    <div className="w-72">
      <Listbox value={selectedOption} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative border border-green-400 w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-green-200 rounded-lg shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-80 focus-visible:ring-green-400 focus-visible:ring-offset-green-300 focus-visible:ring-offset-2 focus-visible:border-green-400 sm:text-sm">
            {selectedOption ? selectedRender() : <span className="block truncate">{label}</span>}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <div className="h-5 w-5">
                <SelectorIcon className="text-gray-500" aria-hidden="true" />
              </div>
            </span>
          </Listbox.Button>
          <Transition as={Fragment}>
            <Listbox.Options className="z-50 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-lg shadow-lg max-h-60 ring-1 ring-green-300 ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((x: string, i: number) => {
                const _x = x.length ? x[0] : x; // if the item has two values, use the first (second is a label)
                return (
                  <Listbox.Option
                    key={uuid()}
                    className={({ active }) =>
                      `${active ? 'text-gray-900 bg-green-100' : 'text-gray-900'}
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                    }
                    value={_x}
                  >
                    {({ selected, active }) => {
                      const asset = label === 'Series' ? assets[seriesMap[_x]?.baseId!] : assets[_x];
                      const logo = markMap?.get(asset?.symbol!);
                      return (
                        <>
                          <div className="flex">
                            <div className="mr-4">{logo && <div className="h-5 w-5">{logo}</div>}</div>
                            <div className="flex">
                              <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                {x[1]}
                              </span>
                            </div>
                          </div>
                          {selected ? (
                            <span
                              className={`${active ? 'text-gray-600' : 'text-gray-600'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <div className="w-5 h-5">
                                <CheckIcon aria-hidden="true" />
                              </div>
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Selecty;
