import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useZkLogin } from '../zklogin/useZkLogin';

interface Props {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated: isZkLoginAuthenticated } = useZkLogin();
  const currentAccount = useCurrentAccount();
  const isWalletConnected = !!currentAccount;
  
  // Allow access if either zkLogin is authenticated OR wallet is connected
  if (!isZkLoginAuthenticated && !isWalletConnected) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
