import React from 'react';
import { Container, Heading, Text } from '@radix-ui/themes';

export const NotFound: React.FC = () => (
  <Container style={{ padding: 16 }}>
    <Heading>404</Heading>
    <Text>Page not found.</Text>
  </Container>
);

export default NotFound;
