import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Container, Flex, Heading, Text } from '@radix-ui/themes';

interface FeedPost {
  id: string;
  content: string;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  timestamp: string;
  likes: number;
}

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/api/posts`);

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        const postsData = data.data || [];

        const transformed: FeedPost[] = postsData.map((post: any) => ({
          id: post.objectId,
          content: post.content,
          author: post.author_address,
          authorName: post.author_username || post.author_address,
          authorAvatar: post.author_image_url || undefined,
          timestamp: new Date(Number(post.created_at_ms)).toISOString(),
          likes: post.like_count || 0,
        }));

        setPosts(transformed);
        setError(null);
      } catch (err) {
        console.error('Failed to load feed posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Text color="gray">Loading latest posts…</Text>;
    }

    if (error) {
      return <Text color="red">{error}</Text>;
    }

    if (posts.length === 0) {
      return <Text color="gray">No posts yet. Be the first to share something!</Text>;
    }

    return (
      <Flex direction="column" gap="3">
        {posts.map((post) => (
          <Card key={post.id}>
            <Flex direction="column" gap="3">
              <Flex gap="3" align="start">
                <Avatar src={post.authorAvatar} fallback={post.authorName?.charAt(0) || 'U'} size="3" />
                <Flex direction="column" gap="1" style={{ flex: 1 }}>
                  <Flex gap="2" align="center" wrap="wrap">
                    <Text size="3" weight="bold">{post.authorName || 'Anonymous'}</Text>
                    <Text size="2" color="gray">
                      @{post.author.slice(0, 6)}...{post.author.slice(-4)} · {new Date(post.timestamp).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Text size="3">{post.content}</Text>
                </Flex>
              </Flex>
              <Flex gap="3">
                <Button variant="soft" size="2" disabled>
                  ❤️ {post.likes}
                </Button>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Flex>
    );
  };

  return (
    <Container size="3" style={{ padding: 24 }}>
      <Flex direction="column" gap="3">
        <Heading size="6">Feed</Heading>
        <Text color="gray">A live feed of Suitter posts will appear here.</Text>
        {renderContent()}
      </Flex>
    </Container>
  );
};

export default Feed;
