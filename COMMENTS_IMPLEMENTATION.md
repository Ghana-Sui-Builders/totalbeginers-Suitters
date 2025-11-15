# 💬 Complete Comments System Implementation Guide

## 📋 Overview

This is a comprehensive Twitter/X-style nested comments system with:
- **Comments** on posts
- **Replies** to comments (unlimited nesting)
- **Likes** on both comments and replies
- **Real-time updates**
- **Optimistic UI**
- **Persistent state**

---

## 🏗️ Architecture

### Smart Contract Structs

```move
/// Comment on a post
Comment {
    id: UID,
    post_id: ID,
    author_profile_id: ID,
    author_address: address,
    content: String,
    created_at_ms: u64,
    like_count: u64,
    reply_count: u64,
}

/// Reply to a comment (nested, unlimited depth)
Reply {
    id: UID,
    comment_id: ID,          // Parent comment
    parent_reply_id: Option<ID>, // Parent reply (for nesting)
    post_id: ID,              // Original post
    author_profile_id: ID,
    author_address: address,
    content: String,
    created_at_ms: u64,
    like_count: u64,
    reply_count: u64,
}

/// Like on a comment
CommentLike {
    id: UID,
    comment_id: ID,
    user_profile_id: ID,
    user_address: address,
    created_at_ms: u64,
}

/// Like on a reply
ReplyLike {
    id: UID,
    reply_id: ID,
    user_profile_id: ID,
    user_address: address,
    created_at_ms: u64,
}
```

---

## 🔧 Smart Contract Functions

### Comment Functions

```move
// Create a comment on a post
public fun create_comment(
    profile: &Profile,
    post: &mut Post,
    user_address: address,
    content: String,
    clock: &Clock,
    ctx: &mut TxContext
)

// Delete a comment
public fun delete_comment(
    comment: Comment,
    profile: &Profile,
    clock: &Clock,
    ctx: &mut TxContext
)
```

### Reply Functions

```move
// Reply to a comment
public fun create_reply_to_comment(
    profile: &Profile,
    comment: &mut Comment,
    user_address: address,
    content: String,
    clock: &Clock,
    ctx: &mut TxContext
)

// Reply to another reply (nested)
public fun create_reply_to_reply(
    profile: &Profile,
    parent_reply: &mut Reply,
    user_address: address,
    content: String,
    clock: &Clock,
    ctx: &mut TxContext
)

// Delete reply from comment
public fun delete_reply_from_comment(
    reply: Reply,
    comment: &mut Comment,
    profile: &Profile,
    clock: &Clock,
    ctx: &mut TxContext
)

// Delete reply from reply
public fun delete_reply_from_reply(
    reply: Reply,
    parent_reply: &mut Reply,
    profile: &Profile,
    clock: &Clock,
    ctx: &mut TxContext
)
```

### Like Functions

```move
// Like a comment
public fun like_comment(
    profile: &mut Profile,
    comment: &mut Comment,
    user_address: address,
    clock: &Clock,
    ctx: &mut TxContext
)

// Unlike a comment
public fun unlike_comment(
    like: CommentLike,
    profile: &mut Profile,
    comment: &mut Comment,
    user_address: address,
    clock: &Clock,
    ctx: &mut TxContext
)

// Like a reply
public fun like_reply(
    profile: &mut Profile,
    reply: &mut Reply,
    user_address: address,
    clock: &Clock,
    ctx: &mut TxContext
)

// Unlike a reply
public fun unlike_reply(
    like: ReplyLike,
    profile: &mut Profile,
    reply: &mut Reply,
    user_address: address,
    clock: &Clock,
    ctx: &mut TxContext
)
```

---

## 📡 Backend API Endpoints

### To Implement in `backend/src/index.ts`:

```typescript
// Get comments for a post
GET /api/posts/:postId/comments
Response: {
  success: boolean;
  comments: CommentObject[];
}

// Get replies for a comment
GET /api/comments/:commentId/replies
Response: {
  success: boolean;
  replies: ReplyObject[];
}

// Get replies for a reply (nested)
GET /api/replies/:replyId/replies
Response: {
  success: boolean;
  replies: ReplyObject[];
}

// Create a comment
POST /api/create-comment
Body: {
  profileId: string;
  postId: string;
  content: string;
  userAddress: string;
}

// Create a reply to comment
POST /api/create-reply-to-comment
Body: {
  profileId: string;
  commentId: string;
  content: string;
  userAddress: string;
}

// Create a reply to reply
POST /api/create-reply-to-reply
Body: {
  profileId: string;
  replyId: string;
  content: string;
  userAddress: string;
}

// Like a comment
POST /api/like-comment
Body: {
  profileId: string;
  commentId: string;
  userAddress: string;
}

// Unlike a comment
POST /api/unlike-comment
Body: {
  profileId: string;
  commentId: string;
  likeId: string;
  userAddress: string;
}

// Like a reply
POST /api/like-reply
Body: {
  profileId: string;
  replyId: string;
  userAddress: string;
}

// Unlike a reply
POST /api/unlike-reply
Body: {
  profileId: string;
  replyId: string;
  likeId: string;
  userAddress: string;
}

// Delete a comment
POST /api/delete-comment
Body: {
  profileId: string;
  commentId: string;
  userAddress: string;
}

// Delete a reply
POST /api/delete-reply
Body: {
  profileId: string;
  replyId: string;
  parentId: string; // commentId or parentReplyId
  isReplyToReply: boolean;
  userAddress: string;
}
```

---

## 🎨 Frontend Components

### 1. **CommentSection.tsx**
Main component that displays all comments for a post

```typescript
interface CommentSectionProps {
  postId: string;
  profileId: string;
}

export function CommentSection({ postId, profileId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // Load comments
  // Create comment
  // Render comment list
}
```

### 2. **Comment.tsx**
Single comment with replies

```typescript
interface CommentProps {
  comment: CommentObject;
  profileId: string;
  onReply: (commentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  onUnlike: (commentId: string, likeId: string) => void;
  onDelete: (commentId: string) => void;
}

export function Comment({ comment, profileId, ... }: CommentProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  
  // Load replies when expanded
  // Render comment, actions, and nested replies
}
```

### 3. **Reply.tsx**
Single reply with nested replies

```typescript
interface ReplyProps {
  reply: ReplyObject;
  profileId: string;
  onReply: (replyId: string, content: string) => void;
  onLike: (replyId: string) => void;
  onUnlike: (replyId: string, likeId: string) => void;
  onDelete: (replyId: string) => void;
}

export function Reply({ reply, profileId, ... }: ReplyProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  
  // Recursively load and render nested replies
}
```

### 4. **CommentInput.tsx**
Reusable input component

```typescript
interface CommentInputProps {
  placeholder: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
}

export function CommentInput({ placeholder, onSubmit, onCancel }: CommentInputProps) {
  // Input field with submit/cancel buttons
}
```

---

## 🗃️ Backend Service Functions

### `backend/src/sui.service.ts`

```typescript
// Get all comments for a post
export async function getCommentsForPost(postId: string): Promise<CommentObject[]> {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${PACKAGE_ID}::suitter::CommentCreated`
    },
    limit: 100,
    order: 'descending'
  });
  
  const commentIds = events.data
    .filter((e: any) => e.parsedJson?.post_id === postId)
    .map((e: any) => e.parsedJson?.comment_id);
    
  const comments = await suiClient.multiGetObjects({
    ids: commentIds,
    options: { showContent: true, showOwner: true }
  });
  
  return comments.map(formatCommentObject);
}

// Get all replies for a comment
export async function getRepliesForComment(commentId: string): Promise<ReplyObject[]> {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${PACKAGE_ID}::suitter::ReplyCreated`
    },
    limit: 100
  });
  
  const replyIds = events.data
    .filter((e: any) => 
      e.parsedJson?.comment_id === commentId &&
      !e.parsedJson?.parent_reply_id
    )
    .map((e: any) => e.parsedJson?.reply_id);
    
  const replies = await suiClient.multiGetObjects({
    ids: replyIds,
    options: { showContent: true }
  });
  
  return replies.map(formatReplyObject);
}

// Get all replies for a reply (nested)
export async function getRepliesForReply(replyId: string): Promise<ReplyObject[]> {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${PACKAGE_ID}::suitter::ReplyCreated`
    },
    limit: 100
  });
  
  const replyIds = events.data
    .filter((e: any) => e.parsedJson?.parent_reply_id === replyId)
    .map((e: any) => e.parsedJson?.reply_id);
    
  const replies = await suiClient.multiGetObjects({
    ids: replyIds,
    options: { showContent: true }
  });
  
  return replies.map(formatReplyObject);
}
```

---

## 💾 Type Definitions

### `backend/src/types.ts`

```typescript
export interface CommentObject {
  id: string;
  post_id: string;
  author_profile_id: string;
  author_address: string;
  author_username?: string;
  author_image_url?: string;
  content: string;
  created_at_ms: string;
  like_count: number;
  reply_count: number;
}

export interface ReplyObject {
  id: string;
  comment_id: string;
  parent_reply_id?: string;
  post_id: string;
  author_profile_id: string;
  author_address: string;
  author_username?: string;
  author_image_url?: string;
  content: string;
  created_at_ms: string;
  like_count: number;
  reply_count: number;
}

export interface CommentLikeObject {
  id: string;
  comment_id: string;
  user_profile_id: string;
  user_address: string;
  created_at_ms: string;
}

export interface ReplyLikeObject {
  id: string;
  reply_id: string;
  user_profile_id: string;
  user_address: string;
  created_at_ms: string;
}
```

### `frontend/src/types/comment.ts`

```typescript
export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replyCount: number;
  isLiked: boolean;
  likeId?: string;
}

export interface Reply {
  id: string;
  commentId: string;
  parentReplyId?: string;
  postId: string;
  author: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replyCount: number;
  isLiked: boolean;
  likeId?: string;
}
```

---

## 🎯 Implementation Steps

### Phase 1: Contract Deployment ✅
- [x] Add Comment, Reply, CommentLike, ReplyLike structs
- [x] Add comment/reply creation functions
- [x] Add like/unlike functions
- [x] Add delete functions
- [x] Add events
- [ ] **Deploy contract to testnet**
- [ ] **Update .env with new PACKAGE_ID**

### Phase 2: Backend Implementation
- [ ] Add comment service functions to `sui.service.ts`
- [ ] Add comment API endpoints to `index.ts`
- [ ] Add type definitions
- [ ] Test endpoints with Postman/curl

### Phase 3: Frontend Implementation
- [ ] Create type definitions
- [ ] Create CommentSection component
- [ ] Create Comment component with nested replies
- [ ] Create Reply component (recursive)
- [ ] Create CommentInput component
- [ ] Add to Post display
- [ ] Implement optimistic UI updates
- [ ] Add loading states
- [ ] Add error handling

### Phase 4: Features & Polish
- [ ] Add comment sorting (latest, popular)
- [ ] Add "Load more" pagination
- [ ] Add comment threading indicators
- [ ] Add @ mentions
- [ ] Add comment editing
- [ ] Add report/moderation features
- [ ] Add notifications for replies/likes

---

## 🎨 UI/UX Design

### Comment Section Layout

```
┌─────────────────────────────────────┐
│ Post Content                         │
│ ❤️ 45  💬 12  🔁 8                  │
├─────────────────────────────────────┤
│ 💬 Comments (12)                     │
├─────────────────────────────────────┤
│ [Write a comment...]        [Post]   │
├─────────────────────────────────────┤
│ 👤 Alice • 2h ago                    │
│ Great post! Really insightful.       │
│ ❤️ 5 · 💬 Reply · 🗑️ Delete         │
│  ├─ 👤 Bob • 1h ago                  │
│  │  Thanks for sharing!              │
│  │  ❤️ 2 · 💬 Reply                 │
│  │   └─ 👤 Alice • 1h ago           │
│  │      You're welcome!              │
│  │      ❤️ 1 · 💬 Reply             │
├─────────────────────────────────────┤
│ 👤 Charlie • 3h ago                  │
│ Love this feature! 🚀                │
│ ❤️ 12 · 💬 Reply                    │
└─────────────────────────────────────┘
```

---

## 🔐 Security Considerations

1. **Authentication**: All actions require `user_address` to match `profile.owner`
2. **Authorization**: Only comment/reply authors can delete their content
3. **Validation**: Content length limits enforced (MAX_CONTENT_LENGTH = 280)
4. **Rate Limiting**: Backend should implement rate limiting
5. **Spam Prevention**: Consider adding cooldown periods between comments

---

## 📊 Performance Optimizations

1. **Lazy Loading**: Load replies only when expanded
2. **Pagination**: Implement cursor-based pagination for large comment threads
3. **Caching**: Cache comment counts, user likes
4. **Batch Queries**: Use `multiGetObjects` for fetching multiple comments/replies
5. **Event Indexing**: Consider using Sui indexer for faster queries

---

## 🧪 Testing Checklist

- [ ] Create comment on post
- [ ] Reply to comment
- [ ] Reply to reply (3+ levels deep)
- [ ] Like/unlike comment
- [ ] Like/unlike reply
- [ ] Delete comment (own)
- [ ] Delete reply (own)
- [ ] Prevent double-like
- [ ] Prevent unauthorized deletion
- [ ] Handle network errors gracefully
- [ ] Test optimistic UI updates
- [ ] Test with multiple users
- [ ] Test long comment threads
- [ ] Test special characters in content

---

## 📝 Next Steps

1. **Deploy Updated Contract**
   ```bash
   cd contract
   sui client publish --gas-budget 100000000
   ```

2. **Update Environment Variables**
   - Copy new PACKAGE_ID to backend `.env`
   - Copy new PACKAGE_ID to frontend `.env`

3. **Implement Backend Endpoints** (see above)

4. **Create Frontend Components** (see above)

5. **Test End-to-End**

---

## 🎉 Feature Complete!

Once implemented, you'll have a fully functional nested comments system with:
- ✅ Unlimited nesting depth
- ✅ Like/unlike on comments and replies
- ✅ Real-time optimistic updates
- ✅ Persistent state on blockchain
- ✅ Clean, intuitive UI
- ✅ Complete type safety
- ✅ Gas-sponsored transactions

This creates a Twitter/X-level commenting experience on the Sui blockchain! 🚀
