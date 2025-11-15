import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface Post {
  id: string;
  content: string;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  timestamp: string;
  likes: number;
}

interface Profile {
  objectId: string;
  username: string;
  bio?: string;
  imageUrl?: string;
  walletAddress: string;
}

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState<'posts' | 'people'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Austin: Fetch search results when query changes
  useEffect(() => {
    if (!query.trim()) {
      setPosts([]);
      setProfiles([]);
      return;
    }

    const searchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all posts
        const postsResponse = await fetch(API_ENDPOINTS.posts);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          const allPosts = postsData.data || [];
          
          // Filter posts by query (search in content and author name)
          const filteredPosts = allPosts
            .filter((post: any) => 
              post.content?.toLowerCase().includes(query.toLowerCase()) ||
              post.author_username?.toLowerCase().includes(query.toLowerCase()) ||
              post.author_address?.toLowerCase().includes(query.toLowerCase())
            )
            .map((post: any) => ({
              id: post.objectId,
              content: post.content,
              author: post.author_address,
              authorName: post.author_username || post.author_address,
              authorAvatar: post.author_image_url,
              timestamp: new Date(Number(post.created_at_ms)).toISOString(),
              likes: post.like_count || 0,
            }));
          
          setPosts(filteredPosts);
        }

        // Note: We don't have a search endpoint for profiles yet
        // This would need to be implemented in the backend
        // For now, we'll leave profiles empty
        setProfiles([]);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    searchData();
  }, [query]);

  return (
    <div>
      {/* Header with search query */}
      <div className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 p-4 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-black dark:text-white">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          className={`flex-1 py-4 px-4 text-center font-bold transition-colors relative ${
            activeTab === 'posts'
              ? 'text-black dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
          {activeTab === 'posts' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>
          )}
        </button>
        <button
          className={`flex-1 py-4 px-4 text-center font-bold transition-colors relative ${
            activeTab === 'people'
              ? 'text-black dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('people')}
        >
          People
          {activeTab === 'people' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="min-h-screen">
        {loading && (
          <div className="p-8 flex justify-center">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">
              progress_activity
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 text-red-500">{error}</div>
        )}

        {!loading && !error && !query && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            Enter a search query to find posts and people
          </div>
        )}

        {!loading && !error && query && activeTab === 'posts' && (
          <div>
            {posts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No posts found for "{query}"
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {posts.map((post) => (
                  <article key={post.id} className="p-4 flex gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="shrink-0">
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12" 
                        style={{ backgroundImage: `url(${post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}&background=random`})` }}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link 
                            to={`/profile/${post.author}`}
                            className="text-black dark:text-white text-base font-bold leading-normal hover:underline"
                          >
                            {post.authorName || 'Anonymous'}
                          </Link>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                            @{post.author.slice(0, 6)}...{post.author.slice(-4)} · {new Date(post.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-black dark:text-white text-base font-normal leading-normal mt-1">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <span className="material-symbols-outlined text-xl">favorite</span>
                          <p className="text-xs font-normal">{post.likes}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && query && activeTab === 'people' && (
          <div>
            {profiles.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No people found for "{query}"
                <p className="text-sm mt-2">Profile search will be available soon!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {profiles.map((profile) => (
                  <Link
                    key={profile.objectId}
                    to={`/profile/${profile.walletAddress}`}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" 
                        style={{ backgroundImage: `url(${profile.imageUrl || `https://ui-avatars.com/api/?name=${profile.username}&background=random`})` }}
                      ></div>
                      <div>
                        <p className="font-bold text-black dark:text-white">{profile.username}</p>
                        {profile.bio && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">{profile.bio}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
