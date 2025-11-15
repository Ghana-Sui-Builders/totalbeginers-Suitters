import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import * as dotenv from 'dotenv';


dotenv.config();


export const PACKAGE_ID = process.env.PACKAGE_ID!;
export const REGISTRY_ID = process.env.REGISTRY_ID!;
export const SUI_NETWORK = process.env.SUI_NETWORK || 'testnet';



//Initialize the SUI Client

export const suiClient = new SuiClient({
  url: getFullnodeUrl(SUI_NETWORK as 'devnet' | 'testnet' | 'mainnet')
});

console.log(' Sui client initialized for', SUI_NETWORK);

//Fetches all Post objects from the SUI

export async function getAllPosts() {
  try {
    console.log('Fetching posts via event query...');
    
    // Query PostCreated events to get post IDs
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::suitter::PostCreated`
      },
      limit: 50, // Adjust as needed
      order: 'descending' // Most recent first
    });
    
    if (!events.data || events.data.length === 0) {
      console.log('No post events found');
      return [];
    }
    
    // Extract post IDs from events
    const postIds = events.data
      .map((event: any) => event.parsedJson?.post_id)
      .filter((id: any) => id);
    
    if (postIds.length === 0) {
      console.log('No valid post IDs in events');
      return [];
    }
    
    console.log(`Found ${postIds.length} posts from events`);
    
    // Fetch the actual post objects
    const posts = await suiClient.multiGetObjects({
      ids: postIds,
      options: {
        showContent: true,
        showOwner: true,
      },
    });
    
    return posts
      .filter((p: any) => p.data)
      .map((p: any) => p.data);
      
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

//Fetches a single profile by its object ID

export async function getProfile(profileId: string) {
  try {
    const profile = await suiClient.getObject({
      id: profileId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      }
    });
    
    if (!profile.data) {
      throw new Error(`Profile not found: ${profileId}`);
    }
    
    return profile.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error(`Failed to fetch profile: ${error}`);
  }
}

//Get a full object from the blockchain

export async function getObject(objectId: string): Promise<any> {
  try {
    const response = await suiClient.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true
      }
    });

    if (!response.data) {
      throw new Error(`Object not found: ${objectId}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching object:', error);
    throw new Error(`Failed to fetch object ${objectId}: ${error}`);
  }
}

//Check if a username is available 

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const response = await suiClient.getDynamicFieldObject({
      parentId: REGISTRY_ID,
      name: {
        type: '0x1::string::String',
        value: username
      }
    });

    // If we get a result, the username is taken
    return !response.data;
  } catch (error) {
    // If query fails, assume username is unavailable (safe default)
    console.error('Error checking username availability:', error);
    return false;
  }
}

// Get all Like objects for a specific user profile
export async function getUserLikes(profileId: string): Promise<string[]> {
  try {
    const profile = await getProfile(profileId);
    const profileFields = (profile.content as any)?.fields;
    
    if (!profileFields?.liked_posts) {
      return [];
    }
    
    // Extract the post IDs from the VecSet
    const likedPosts = profileFields.liked_posts?.fields?.contents || [];
    return likedPosts;
  } catch (error) {
    console.error('Error fetching user likes:', error);
    return [];
  }
}

// Get Like objects (with IDs) for a user's liked posts
export async function getUserLikeObjects(profileId: string): Promise<{ postId: string; likeId: string }[]> {
  try {
    // First, get the liked post IDs from the profile's VecSet (source of truth)
    const profile = await getProfile(profileId);
    const profileFields = (profile.content as any)?.fields;
    
    if (!profileFields?.liked_posts) {
      return [];
    }
    
    // Extract the post IDs from the VecSet
    const likedPostIds: string[] = profileFields.liked_posts?.fields?.contents || [];
    
    if (likedPostIds.length === 0) {
      return [];
    }
    
    console.log(`Found ${likedPostIds.length} liked posts in profile's VecSet`);
    
    // Query PostLiked events for this user to get the Like object IDs
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::suitter::PostLiked`
      },
      limit: 100,
      order: 'descending'
    });
    
    if (!events.data || events.data.length === 0) {
      console.log('No PostLiked events found');
      return [];
    }
    
    // Filter events for this user and only include posts that are still in liked_posts
    const userLikes = events.data
      .map((event: any) => {
        const parsed = event.parsedJson;
        if (parsed?.user_profile_id === profileId && likedPostIds.includes(parsed.post_id)) {
          return {
            postId: parsed.post_id,
            likeId: parsed.like_id,
          };
        }
        return null;
      })
      .filter((like): like is { postId: string; likeId: string } => like !== null);
    
    console.log(`Matched ${userLikes.length} Like objects with profile's liked posts`);
    return userLikes;
  } catch (error) {
    console.error('Error fetching user like objects:', error);
    return [];
  }
}

// ============================================================================
// COMMENT & REPLY FUNCTIONS
// ============================================================================

/**
 * Get all comments for a specific post
 */
export async function getPostComments(postId: string) {
  try {
    console.log(`Fetching comments for post: ${postId}`);
    
    // Query CommentCreated events to get comment IDs
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::suitter::CommentCreated`
      },
      limit: 100,
      order: 'descending'
    });
    
    if (!events.data || events.data.length === 0) {
      console.log('No comment events found');
      return [];
    }
    
    // Filter events for this specific post
    const commentIds = events.data
      .filter((event: any) => event.parsedJson?.post_id === postId)
      .map((event: any) => event.parsedJson?.comment_id)
      .filter((id: any) => id);
    
    if (commentIds.length === 0) {
      console.log(`No comments found for post ${postId}`);
      return [];
    }
    
    console.log(`Found ${commentIds.length} comments from events`);
    
    // Fetch the actual comment objects
    const comments = await suiClient.multiGetObjects({
      ids: commentIds,
      options: {
        showContent: true,
        showOwner: true,
      },
    });
    
    return comments
      .filter((c: any) => c.data)
      .map((c: any) => c.data);
      
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

/**
 * Get all replies for a specific comment
 */
export async function getCommentReplies(commentId: string) {
  try {
    console.log(`Fetching replies for comment: ${commentId}`);
    
    // Query ReplyCreated events to get reply IDs
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::suitter::ReplyCreated`
      },
      limit: 100,
      order: 'descending'
    });
    
    if (!events.data || events.data.length === 0) {
      console.log('No reply events found');
      return [];
    }
    
    // Filter events for this specific comment
    const replyIds = events.data
      .filter((event: any) => event.parsedJson?.comment_id === commentId)
      .map((event: any) => event.parsedJson?.reply_id)
      .filter((id: any) => id);
    
    if (replyIds.length === 0) {
      console.log(`No replies found for comment ${commentId}`);
      return [];
    }
    
    console.log(`Found ${replyIds.length} replies from events`);
    
    // Fetch the actual reply objects
    const replies = await suiClient.multiGetObjects({
      ids: replyIds,
      options: {
        showContent: true,
        showOwner: true,
      },
    });
    
    return replies
      .filter((r: any) => r.data)
      .map((r: any) => r.data);
      
  } catch (error) {
    console.error('Error fetching replies:', error);
    return [];
  }
}

/**
 * Get a single comment by ID
 */
export async function getCommentById(commentId: string): Promise<any> {
  try {
    const comment = await suiClient.getObject({
      id: commentId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      }
    });
    
    if (!comment.data) {
      throw new Error(`Comment not found: ${commentId}`);
    }
    
    return comment.data;
  } catch (error) {
    console.error('Error fetching comment:', error);
    throw new Error(`Failed to fetch comment: ${error}`);
  }
}

/**
 * Get a single reply by ID
 */
export async function getReplyById(replyId: string): Promise<any> {
  try {
    const reply = await suiClient.getObject({
      id: replyId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      }
    });
    
    if (!reply.data) {
      throw new Error(`Reply not found: ${replyId}`);
    }
    
    return reply.data;
  } catch (error) {
    console.error('Error fetching reply:', error);
    throw new Error(`Failed to fetch reply: ${error}`);
  }
}

