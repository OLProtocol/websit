import useSWR from 'swr';

const fetcher = (args) =>
  fetch(args)
    .then((res) => res.json())
    .then(({ code, msg, data }) => {
      if (code === 0) {
        return data;
      } else {
        console.log('error: ' + msg);
      }
    });

const { VITE_API_HOST } = import.meta.env;
interface Ord2ListStatusParams {
  start: number;
  limit: number;
  sort?: string;
  ticker_hex?: string;
  complete?: string;
}
export const generateUrl = (url: string) => {
  return `${VITE_API_HOST}/${url}`;
};
export const useOrd2Status = ({ start, limit }: Ord2ListStatusParams) => {
  console.log(start);
  console.log(limit);
  const { data, error, isLoading } = useSWR(
    generateUrl('v1/indexer/ord2/status'),
    fetcher,
  );
  return {
    data,
    error,
    isLoading,
  };
};

interface Ord2InfoParams {
  tick?: string;
}
export const useOrd2Info = ({ tick }: Ord2InfoParams) => {
  const { data, error, isLoading } = useSWR(
    generateUrl(`v1/indexer/ord2/${tick}/info`),
    fetcher,
  );
  return {
    data,
    error,
    isLoading,
  };
};
