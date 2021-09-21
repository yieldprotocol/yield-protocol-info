import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import EventTable from '../EventTable';
// import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Contract = () => {
  const { addr } = useParams<{ addr: string }>();
  const events = useAppSelector((st) => st.chain.events);
  const contractEvents = events[addr!];
  return (
    <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-lg pb-4 flex gap-x-2">
        <EventTable events={contractEvents} />
      </div>
    </div>
  );
};

export default Contract;
