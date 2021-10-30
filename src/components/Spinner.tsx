import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = ({ loading, ...props }: { loading: boolean }) =>
  loading ? (
    <div className="text-center">
      <ClipLoader loading={loading} {...props} />
    </div>
  ) : null;

export default Spinner;
