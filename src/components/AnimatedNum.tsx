import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { formatValue } from '../utils/appUtils';

const AnimatedNum = ({ num }: { num: number }) => {
  const spring = useSpring({
    reset: true,
    from: { number: 0 },
    number: num,
    delay: 100,
    config: config.default,
  });
  return <animated.div>{spring.number.to((n: number) => n.toFixed())}</animated.div>;
};

export default AnimatedNum;
