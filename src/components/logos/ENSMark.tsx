import * as React from 'react';

function ENSMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 72.52 80.95"
      height="1em"
      width="1em"
      {...props}
    >
      <defs>
        <linearGradient id="linear-gradient" x1={41.95} y1={2.57} x2={12.57} y2={34.42} gradientUnits="userSpaceOnUse">
          <stop offset={0.58} stopColor="#a0a8d4" />
          <stop offset={0.73} stopColor="#8791c7" />
          <stop offset={0.91} stopColor="#6470b4" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1={42.57}
          y1={81.66}
          x2={71.96}
          y2={49.81}
          xlinkHref="#linear-gradient"
        />
        <linearGradient
          id="linear-gradient-3"
          x1={42.26}
          y1={1.24}
          x2={42.26}
          y2={82.84}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#513eff" />
          <stop offset={0.18} stopColor="#5157ff" />
          <stop offset={0.57} stopColor="#5298ff" />
          <stop offset={1} stopColor="#52e5ff" />
        </linearGradient>
        <style>{'.cls-3{fill:#a0a8d4}'}</style>
      </defs>
      <g
        style={{
          isolation: 'isolate',
        }}
      >
        <g id="Layer_1" data-name="Layer 1">
          <path
            d="M15.28 34.39c.8 1.71 2.78 5.09 2.78 5.09L40.95 1.64l-22.34 15.6a9.75 9.75 0 0 0-3.18 3.5 16.19 16.19 0 0 0-.15 13.65z"
            transform="translate(-6 -1.64)"
            fill="url(#linear-gradient)"
          />
          <path
            className="cls-3"
            d="M6.21 46.85a25.47 25.47 0 0 0 10 18.51l24.71 17.23s-15.46-22.28-28.5-44.45a22.39 22.39 0 0 1-2.62-7.56 12.1 12.1 0 0 1 0-3.63c-.34.63-1 1.92-1 1.92a29.35 29.35 0 0 0-2.67 8.55 52.28 52.28 0 0 0 .08 9.43z"
            transform="translate(-6 -1.64)"
          />
          <path
            d="M69.25 49.84c-.8-1.71-2.78-5.09-2.78-5.09L43.58 82.59 65.92 67a9.75 9.75 0 0 0 3.18-3.5 16.19 16.19 0 0 0 .15-13.66z"
            transform="translate(-6 -1.64)"
            fill="url(#linear-gradient-2)"
          />
          <path
            className="cls-3"
            d="M78.32 37.38a25.47 25.47 0 0 0-10-18.51L43.61 1.64s15.45 22.28 28.5 44.45a22.39 22.39 0 0 1 2.61 7.56 12.1 12.1 0 0 1 0 3.63c.34-.63 1-1.92 1-1.92a29.35 29.35 0 0 0 2.67-8.55 52.28 52.28 0 0 0-.07-9.43z"
            transform="translate(-6 -1.64)"
          />
          <path
            d="M15.43 20.74a9.75 9.75 0 0 1 3.18-3.5l22.34-15.6-22.89 37.85s-2-3.38-2.78-5.09a16.19 16.19 0 0 1 .15-13.66zM6.21 46.85a25.47 25.47 0 0 0 10 18.51l24.71 17.23s-15.46-22.28-28.5-44.45a22.39 22.39 0 0 1-2.62-7.56 12.1 12.1 0 0 1 0-3.63c-.34.63-1 1.92-1 1.92a29.35 29.35 0 0 0-2.67 8.55 52.28 52.28 0 0 0 .08 9.43zm63 3c-.8-1.71-2.78-5.09-2.78-5.09L43.58 82.59 65.92 67a9.75 9.75 0 0 0 3.18-3.5 16.19 16.19 0 0 0 .15-13.66zm9.07-12.46a25.47 25.47 0 0 0-10-18.51L43.61 1.64s15.45 22.28 28.5 44.45a22.39 22.39 0 0 1 2.61 7.56 12.1 12.1 0 0 1 0 3.63c.34-.63 1-1.92 1-1.92a29.35 29.35 0 0 0 2.67-8.55 52.28 52.28 0 0 0-.07-9.43z"
            transform="translate(-6 -1.64)"
            style={{
              mixBlendMode: 'color',
            }}
            fill="url(#linear-gradient-3)"
          />
        </g>
      </g>
    </svg>
  );
}

export default ENSMark;
