import { useEffect } from 'react';

export const Brc20List = () => {
  const getBrc20List = async () => {
    const res = await fetch('https://open-api.unisat.io/v1/indexer/brc20/list').then(
      (res) => res.json(),
    );
    console.log(res);
  };
  useEffect(() => {
    getBrc20List();
  }, []);
  return <div></div>;
};
