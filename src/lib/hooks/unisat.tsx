import { useContext } from 'react';
import { ConnectionContext } from '@/provider/UnisatConnectProvider';
export const useUnisatConnect = () => useContext(ConnectionContext);

export const useUnisat = () => {
  return window.unisat;
}