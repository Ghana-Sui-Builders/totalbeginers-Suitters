import React from 'react';
import { Container, Heading, Text } from '@radix-ui/themes';
import { useParams } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { id } = useParams();
  return (
    <Container style={{ padding: 16 }}>
      <Heading>Profile</Heading>
      <Text>Profile page for {id}</Text>
    </Container>
  );
};

export default Profile;
