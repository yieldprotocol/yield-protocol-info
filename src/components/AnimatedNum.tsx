import React from 'react';
import { useSpring, animated, config } from 'react-spring';

const AnimatedNum = ({ num }: { num: number }) => {
  const spring = useSpring({
    reset: true,
    from: { number: 0 },
    number: num,
    delay: 100,
    config: config.default,
  });
  const formatNum = (val: any) => new Intl.NumberFormat().format(val);
  return <animated.div>{spring.number.to((n: number) => formatNum(n.toFixed()))}</animated.div>;
};

export default AnimatedNum;
