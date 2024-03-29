import * as React from 'react';

function EthMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1920 1920" width="1em" height="1em" {...props}>
      <path fill="#8A92B2" d="M959.8 80.7L420.1 976.3 959.8 731z" />
      {/* <circle fill="#FFFFF" cx="127" cy="127" r="127" /> */}
      <path fill="#62688F" d="M959.8 731L420.1 976.3l539.7 319.1zM1499.6 976.3L959.8 80.7V731z" />
      <path fill="#454A75" d="M959.8 1295.4l539.8-319.1L959.8 731z" />
      <path fill="#8A92B2" d="M420.1 1078.7l539.7 760.6v-441.7z" />
      <path fill="#62688F" d="M959.8 1397.6v441.7l540.1-760.6z" />
    </svg>
  );
}

export default EthMark;
