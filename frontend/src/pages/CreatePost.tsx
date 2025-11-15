import React from 'react';
import { Container, Heading, Text } from '@radix-ui/themes';

export const CreatePost: React.FC = () => {
  return (
    <Container style={{ padding: 16 }}>
      <Heading>Create Post</Heading>
      <Text>Use this page to create a new post (UI only for now).</Text>
    </Container>
  );
};

export default CreatePost;
