import {
  useQuery,
} from '@tanstack/react-query';

export const FetchData = (key:string[], fetchFn:any) => {
  const { isPending, data } = useQuery({
    queryKey: key,
    queryFn: fetchFn,
  });
  return {isPending, data}
};
