/**
 * ZkLoginButton Component
 */

import { Button, Flex, Text, Box } from '@radix-ui/themes';
import { useZkLogin } from './useZkLogin';

interface ZkLoginButtonProps {
  onLoginSuccess?: (address: string) => void;
  onLogout?: () => void;
}

export function ZkLoginButton({ onLoginSuccess, onLogout }: ZkLoginButtonProps) {
  const {
    isLoading,
    isAuthenticated,
    userAddress,
    decodedJWT,
    error,
    login,
    logout,
  } = useZkLogin();

  // Call callback when login succeeds
  if (isAuthenticated && userAddress && onLoginSuccess) {
    onLoginSuccess(userAddress);
  }

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  if (isAuthenticated && userAddress) {
    return (
      <Flex direction="column" gap="2" align="end">
        <Flex gap="2" align="center">
          {decodedJWT?.picture && (
            <Box>
              <img
                src={decodedJWT.picture}
                alt="Profile"
                style={{ width: 32, height: 32, borderRadius: '50%' }}
              />
            </Box>
          )}
          <Flex direction="column" gap="1">
            {decodedJWT?.name && (
              <Text size="2" weight="bold">
                {decodedJWT.name}
              </Text>
            )}
            <Text size="1" color="gray">
              {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </Text>
          </Flex>
          <Button onClick={handleLogout} variant="soft" color="red" size="2">
            Logout
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="2" align="end">
      <Button
        onClick={login}
        disabled={isLoading}
        size="3"
        variant="solid"
      >
        {isLoading ? 'Loading...' : 'Sign in with Google'}
      </Button>
      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Flex>
  );
}
