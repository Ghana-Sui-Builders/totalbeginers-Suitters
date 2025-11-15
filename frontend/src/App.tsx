import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ZkLoginButton } from './zklogin/ZkLoginButton';
import { useZkLogin } from './zklogin/useZkLogin';
import Home from "./pages/home";
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated: isZkLoginAuthenticated } = useZkLogin();
  const currentAccount = useCurrentAccount();
  const isWalletConnected = !!currentAccount;

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>🐦 Suitter</Heading>
        </Box>

        <Flex gap="3" align="center">
          {/* Show ZkLogin button only if wallet is NOT connected */}
          {!isWalletConnected && (
            <Box>
              <ZkLoginButton />
            </Box>
          )}
          
          {/* Show Connect Wallet button only if zkLogin is NOT authenticated */}
          {!isZkLoginAuthenticated && (
            <Box>
              <ConnectButton />
            </Box>
          )}
        </Flex>
      </Flex>
      <Container>
        <BrowserRouter>
          <Box style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
            <Link to="/">Home</Link>
            <Link to="/feed">Feed</Link>
            <Link to="/create">Create</Link>
          </Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;
