module suitter::suitter  {
    
    use sui::clock::{Self, Clock};
    use sui::event;
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::vec_set::{Self, VecSet};
    use sui::table::{Self, Table};
    use sui::display;
    use sui::package;

    // === Errors ===
    const E_NOT_AUTHOR: u64 = 0;
    const E_USERNAME_TOO_LONG: u64 = 1;
    const E_USERNAME_TOO_SHORT: u64 = 2;
    const E_BIO_TOO_LONG: u64 = 3;
    const E_CONTENT_TOO_LONG: u64 = 4;
    const E_CONTENT_EMPTY: u64 = 5;
    const E_INVALID_URL: u64 = 6;
    const E_ALREADY_LIKED: u64 = 8;
    const E_ALREADY_FOLLOWING: u64 = 9;
    const E_CANNOT_FOLLOW_SELF: u64 = 10;
    const E_USERNAME_EXISTS: u64 = 11;
    const E_NOT_PROFILE_OWNER: u64 = 12;

    // === Constants ===
    const MAX_USERNAME_LENGTH: u64 = 30;
    const MIN_USERNAME_LENGTH: u64 = 3;
    const MAX_BIO_LENGTH: u64 = 160;
    const MAX_CONTENT_LENGTH: u64 = 280;
    const MAX_URL_LENGTH: u64 = 500;

    // One Time Witness
    public struct SUITTER has drop {}

    // === Registry (Simplified - Only tracks usernames) ===
    public struct Registry has key {
        id: UID,
        /// Maps username -> profile_id to ensure username uniqueness
        usernames: Table<String, ID>,
    }

    // === Core Structs ===

    /// A user's on-chain identity
    public struct Profile has key, store {
        id: UID,
        owner: address,
        username: String,
        bio: String,
        image_url: Url,
        created_at_ms: u64,
        /// Track posts this profile has liked (prevents duplicates)
        liked_posts: VecSet<ID>,
        /// Track profiles this user follows (prevents duplicates)
        following: VecSet<ID>,
    }

    /// A single post
    public struct Post has key, store {
        id: UID,
        author_profile_id: ID,
        author_address: address,
        content: String,
        image_url: Option<Url>,
        created_at_ms: u64,
        /// Count of likes (for easy querying)
        like_count: u64,
    }

    /// A single like on a post
    public struct Like has key, store {
        id: UID,
        post_id: ID,
        user_profile_id: ID,
        user_address: address,
        created_at_ms: u64,
    }

    /// A single follow relationship
    public struct Follow has key, store {
        id: UID,
        follower_id: ID,
        follower_address: address,
        followed_id: ID,
        followed_address: address,
        created_at_ms: u64,
    }

    /// A comment on a post
    public struct Comment has key, store {
        id: UID,
        post_id: ID,
        author_profile_id: ID,
        author_address: address,
        content: String,
        created_at_ms: u64,
        like_count: u64,
        reply_count: u64,
    }

    /// A reply to a comment (nested comments)
    public struct Reply has key, store {
        id: UID,
        comment_id: ID,          // The comment this is replying to
        parent_reply_id: Option<ID>, // If replying to another reply (for unlimited nesting)
        post_id: ID,              // Original post (for easy querying)
        author_profile_id: ID,
        author_address: address,
        content: String,
        created_at_ms: u64,
        like_count: u64,
        reply_count: u64,
    }

    /// A like on a comment
    public struct CommentLike has key, store {
        id: UID,
        comment_id: ID,
        user_profile_id: ID,
        user_address: address,
        created_at_ms: u64,
    }

    /// A like on a reply
    public struct ReplyLike has key, store {
        id: UID,
        reply_id: ID,
        user_profile_id: ID,
        user_address: address,
        created_at_ms: u64,
    }
    
    // === Events ===
    
    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        username: String,
        timestamp_ms: u64,
    }
    
    public struct ProfileUpdated has copy, drop {
        profile_id: ID,
        owner: address,
        username: String,
        timestamp_ms: u64,
    }

    public struct ProfileDeleted has copy, drop {
        profile_id: ID,
        owner: address,
        timestamp_ms: u64,
    }
    
    public struct PostCreated has copy, drop {
        post_id: ID,
        author_profile_id: ID,
        author_address: address,
        timestamp_ms: u64,
    }

    public struct PostDeleted has copy, drop {
        post_id: ID,
        author_profile_id: ID,
        timestamp_ms: u64,
    }

    public struct PostLiked has copy, drop {
        like_id: ID,
        post_id: ID,
        user_profile_id: ID,
        timestamp_ms: u64,
    }

    public struct PostUnliked has copy, drop {
        post_id: ID,
        user_profile_id: ID,
        timestamp_ms: u64,
    }

    public struct UserFollowed has copy, drop {
        follow_id: ID,
        follower_id: ID,
        followed_id: ID,
        timestamp_ms: u64,
    }

    public struct UserUnfollowed has copy, drop {
        follower_id: ID,
        followed_id: ID,
        timestamp_ms: u64,
    }

    public struct CommentCreated has copy, drop {
        comment_id: ID,
        post_id: ID,
        author_profile_id: ID,
        author_address: address,
        timestamp_ms: u64,
    }

    public struct CommentDeleted has copy, drop {
        comment_id: ID,
        post_id: ID,
        timestamp_ms: u64,
    }

    public struct ReplyCreated has copy, drop {
        reply_id: ID,
        comment_id: ID,
        parent_reply_id: Option<ID>,
        post_id: ID,
        author_profile_id: ID,
        author_address: address,
        timestamp_ms: u64,
    }

    public struct ReplyDeleted has copy, drop {
        reply_id: ID,
        comment_id: ID,
        timestamp_ms: u64,
    }

    public struct CommentLiked has copy, drop {
        like_id: ID,
        comment_id: ID,
        user_profile_id: ID,
        timestamp_ms: u64,
    }

    public struct CommentUnliked has copy, drop {
        comment_id: ID,
        user_profile_id: ID,
        timestamp_ms: u64,
    }

    public struct ReplyLiked has copy, drop {
        like_id: ID,
        reply_id: ID,
        user_profile_id: ID,
        timestamp_ms: u64,
    }

    public struct ReplyUnliked has copy, drop {
        reply_id: ID,
        user_profile_id: ID,
        timestamp_ms: u64,
    }

    /// Initialize the module (Simplified - No SponsorCap)
    fun init(otw: SUITTER, ctx: &mut TxContext) {
        // Create the registry for tracking unique usernames
        let registry = Registry {
            id: object::new(ctx),
            usernames: table::new(ctx),
        };

        // Setup display for Profile
        let publisher = package::claim(otw, ctx);
        let profile_keys = vector[
            b"name".to_string(),
            b"description".to_string(),
            b"image_url".to_string(),
            b"creator".to_string(),
        ];
        let profile_values = vector[
            b"@{username}".to_string(),
            b"{bio}".to_string(),
            b"{image_url}".to_string(),
            b"{owner}".to_string(),
        ];
        
        let mut profile_display = display::new_with_fields<Profile>(
            &publisher,
            profile_keys,
            profile_values,
            ctx,
        );
        profile_display.update_version();

        // Transfer objects
        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(profile_display, ctx.sender());
        transfer::share_object(registry);
    }

    // === Validation Helper Functions ===

    /// Validates username constraints
    fun validate_username(username: &String) {
        let len = string::length(username);
        assert!(len >= MIN_USERNAME_LENGTH, E_USERNAME_TOO_SHORT);
        assert!(len <= MAX_USERNAME_LENGTH, E_USERNAME_TOO_LONG);
    }

    /// Validates bio constraints
    fun validate_bio(bio: &String) {
        assert!(string::length(bio) <= MAX_BIO_LENGTH, E_BIO_TOO_LONG);
    }

    /// Validates post content
    fun validate_content(content: &String) {
        let len = string::length(content);
        assert!(len > 0, E_CONTENT_EMPTY);
        assert!(len <= MAX_CONTENT_LENGTH, E_CONTENT_TOO_LONG);
    }

    /// Validates URL string
    fun validate_url_string(url_str: &String) {
        let len = string::length(url_str);
        if (len > 0) {
            assert!(len <= MAX_URL_LENGTH, E_INVALID_URL);
            // Basic validation: check if it starts with http:// or https://
            let bytes = string::as_bytes(url_str);
            let starts_with_http = len >= 7 && 
                *vector::borrow(bytes, 0) == 104 && // 'h'
                *vector::borrow(bytes, 1) == 116 && // 't'
                *vector::borrow(bytes, 2) == 116 && // 't'
                *vector::borrow(bytes, 3) == 112;   // 'p'
            assert!(starts_with_http, E_INVALID_URL);
        }
    }

    // === Profile Functions ===

    /// Creates a new Profile for a user (Gas sponsored by backend)
    /// user_address: The zkLogin address of the user (not the sponsor)
    public fun create_profile(
        registry: &mut Registry,
        user_address: address,
        username: String,
        bio: String,
        image_url_str: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate inputs
        validate_username(&username);
        validate_bio(&bio);
        validate_url_string(&image_url_str);

        // Check if username is already taken
        assert!(!table::contains(&registry.usernames, username), E_USERNAME_EXISTS);

        let image_url = url::new_unsafe_from_bytes(*string::as_bytes(&image_url_str));
        let timestamp = clock::timestamp_ms(clock);
        
        // Use the provided user_address (zkLogin address) instead of tx sender (sponsor)
        let owner = user_address;

        let profile = Profile {
            id: object::new(ctx),
            owner, // Set directly from transaction sender
            username,
            bio,
            image_url,
            created_at_ms: timestamp,
            liked_posts: vec_set::empty(),
            following: vec_set::empty(),
        };

        let profile_id = object::id(&profile);

        // Register username in the registry
        table::add(&mut registry.usernames, profile.username, profile_id);

        event::emit(ProfileCreated {
            profile_id,
            owner,
            username: profile.username,
            timestamp_ms: timestamp,
        });

        // Share the profile so anyone can reference it (but owner field tracks ownership)
        transfer::share_object(profile);
    }

    /// Updates an existing user profile (Simplified - checks tx_context::sender)
    public fun update_profile(
        registry: &mut Registry,
        profile: &mut Profile,
        new_username: String,
        new_bio: String,
        new_image_url_str: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // SIMPLIFIED SECURITY: Only check that the transaction sender owns this profile
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);

        // Validate inputs
        validate_username(&new_username);
        validate_bio(&new_bio);
        validate_url_string(&new_image_url_str);

        // If username is changing, check availability
        if (profile.username != new_username) {
            assert!(!table::contains(&registry.usernames, new_username), E_USERNAME_EXISTS);
            
            // Remove old username and add new one
            table::remove(&mut registry.usernames, profile.username);
            table::add(&mut registry.usernames, new_username, object::id(profile));
        };

        // Update profile
        profile.username = new_username;
        profile.bio = new_bio;
        profile.image_url = url::new_unsafe_from_bytes(*string::as_bytes(&new_image_url_str));

        event::emit(ProfileUpdated {
            profile_id: object::id(profile),
            owner: profile.owner,
            username: new_username,
            timestamp_ms: clock::timestamp_ms(clock),
        });
    }

    /// Deletes a user profile (Simplified - checks tx_context::sender)
    public fun delete_profile(
        registry: &mut Registry,
        profile: Profile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // SIMPLIFIED SECURITY: Only check that the transaction sender owns this profile
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);

        let profile_id = object::id(&profile);
        
        // Remove from registry
        table::remove(&mut registry.usernames, profile.username);

        event::emit(ProfileDeleted {
            profile_id,
            owner: profile.owner,
            timestamp_ms: clock::timestamp_ms(clock),
        });

        // Unpack and delete
        let Profile { 
            id, 
            owner: _,
            username: _,
            bio: _,
            image_url: _,
            created_at_ms: _,
            liked_posts: _,
            following: _,
        } = profile;
        object::delete(id);
    }

    // === Post Functions ===

    /// Creates a new Post (Backend-sponsored - accepts user_address)
    public fun create_post(
        profile: &Profile,
        user_address: address,
        content: String,
        image_url_str: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify the user_address owns this profile
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);

        validate_content(&content);
        if (string::length(&image_url_str) > 0) {
            validate_url_string(&image_url_str);
        };

        let image_url_option = if (string::length(&image_url_str) > 0) {
            option::some(url::new_unsafe_from_bytes(*string::as_bytes(&image_url_str)))
        } else {
            option::none()
        };

        let timestamp = clock::timestamp_ms(clock);

        let post = Post {
            id: object::new(ctx),
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            content,
            image_url: image_url_option,
            created_at_ms: timestamp,
            like_count: 0,
        };

        event::emit(PostCreated {
            post_id: object::id(&post),
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            timestamp_ms: timestamp,
        });

        transfer::share_object(post);
    }

    /// Deletes a Post (Simplified - checks tx_context::sender via profile)
    public fun delete_post(
        post: Post,
        profile: &Profile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // SIMPLIFIED SECURITY: Ensure the caller owns the profile
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);
        
        // Ensure the post belongs to this profile
        assert!(post.author_profile_id == object::id(profile), E_NOT_AUTHOR);
        
        event::emit(PostDeleted {
            post_id: object::id(&post),
            author_profile_id: post.author_profile_id,
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let Post { id, .. } = post;
        object::delete(id);
    }

    // === Interaction Functions ===

    /// Likes a post (Simplified - checks tx_context::sender via profile)
    public fun like_post(
        profile: &mut Profile,
        post: &mut Post,
        user_address: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Ensure the provided user address owns this profile
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);

        let post_id = object::id(post);
        
        // Prevent duplicate likes
        assert!(!vec_set::contains(&profile.liked_posts, &post_id), E_ALREADY_LIKED);

        let timestamp = clock::timestamp_ms(clock);

        let like = Like {
            id: object::new(ctx),
            post_id,
            user_profile_id: object::id(profile),
            user_address,
            created_at_ms: timestamp,
        };

        let like_id = object::id(&like);

        // Update profile's liked posts
        vec_set::insert(&mut profile.liked_posts, post_id);
        
        // Increment post like count
        post.like_count = post.like_count + 1;

        event::emit(PostLiked {
            like_id,
            post_id,
            user_profile_id: object::id(profile),
            timestamp_ms: timestamp,
        });

        transfer::share_object(like);
    }

    /// Unlikes a post (Simplified - checks tx_context::sender via profile)
    public fun unlike_post(
        like: Like,
        profile: &mut Profile,
        post: &mut Post,
        user_address: address,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        // Ensure the provided user address owns this profile
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        
        // Ensure this like belongs to this profile
        assert!(like.user_profile_id == object::id(profile), E_NOT_AUTHOR);
        
        // Remove from profile's liked posts
        vec_set::remove(&mut profile.liked_posts, &like.post_id);
        
        // Decrement post like count
        if (post.like_count > 0) {
            post.like_count = post.like_count - 1;
        };

        event::emit(PostUnliked {
            post_id: like.post_id,
            user_profile_id: object::id(profile),
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let Like { id, .. } = like;
        object::delete(id);
    }

    /// Follows another user (Simplified - checks tx_context::sender via profile)
    public fun follow(
        my_profile: &mut Profile,
        profile_to_follow: &Profile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // SIMPLIFIED SECURITY: Ensure the caller owns their profile
        assert!(my_profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);

        let followed_id = object::id(profile_to_follow);
        
        // Prevent self-following
        assert!(object::id(my_profile) != followed_id, E_CANNOT_FOLLOW_SELF);
        
        // Prevent duplicate follows
        assert!(!vec_set::contains(&my_profile.following, &followed_id), E_ALREADY_FOLLOWING);

        let timestamp = clock::timestamp_ms(clock);

        let follow_obj = Follow {
            id: object::new(ctx),
            follower_id: object::id(my_profile),
            follower_address: my_profile.owner,
            followed_id,
            followed_address: profile_to_follow.owner,
            created_at_ms: timestamp,
        };

        let follow_id = object::id(&follow_obj);

        // Update profile's following list
        vec_set::insert(&mut my_profile.following, followed_id);

        event::emit(UserFollowed {
            follow_id,
            follower_id: object::id(my_profile),
            followed_id,
            timestamp_ms: timestamp,
        });

        transfer::share_object(follow_obj);
    }

    /// Unfollows a user (Simplified - checks tx_context::sender via profile)
    public fun unfollow(
        follow_obj: Follow,
        my_profile: &mut Profile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // SIMPLIFIED SECURITY: Ensure the caller owns their profile
        assert!(my_profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);
        
        // Ensure this follow belongs to this profile
        assert!(follow_obj.follower_id == object::id(my_profile), E_NOT_AUTHOR);
        
        // Remove from profile's following list
        vec_set::remove(&mut my_profile.following, &follow_obj.followed_id);

        event::emit(UserUnfollowed {
            follower_id: object::id(my_profile),
            followed_id: follow_obj.followed_id,
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let Follow { id, .. } = follow_obj;
        object::delete(id);
    }

    // === Comment Functions ===

    /// Creates a comment on a post
    public fun create_comment(
        profile: &Profile,
        post: &mut Post,
        user_address: address,
        content: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify the user_address owns this profile
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        
        validate_content(&content);
        
        let timestamp = clock::timestamp_ms(clock);
        let post_id = object::id(post);

        let comment = Comment {
            id: object::new(ctx),
            post_id,
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            content,
            created_at_ms: timestamp,
            like_count: 0,
            reply_count: 0,
        };

        let comment_id = object::id(&comment);

        event::emit(CommentCreated {
            comment_id,
            post_id,
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            timestamp_ms: timestamp,
        });

        transfer::share_object(comment);
    }

    /// Deletes a comment
    public fun delete_comment(
        comment: Comment,
        profile: &Profile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);
        assert!(comment.author_profile_id == object::id(profile), E_NOT_AUTHOR);
        
        event::emit(CommentDeleted {
            comment_id: object::id(&comment),
            post_id: comment.post_id,
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let Comment { id, .. } = comment;
        object::delete(id);
    }

    /// Creates a reply to a comment
    public fun create_reply_to_comment(
        profile: &Profile,
        comment: &mut Comment,
        user_address: address,
        content: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        validate_content(&content);
        
        let timestamp = clock::timestamp_ms(clock);
        let comment_id = object::id(comment);

        let reply = Reply {
            id: object::new(ctx),
            comment_id,
            parent_reply_id: option::none(),
            post_id: comment.post_id,
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            content,
            created_at_ms: timestamp,
            like_count: 0,
            reply_count: 0,
        };

        let reply_id = object::id(&reply);
        comment.reply_count = comment.reply_count + 1;

        event::emit(ReplyCreated {
            reply_id,
            comment_id,
            parent_reply_id: option::none(),
            post_id: comment.post_id,
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            timestamp_ms: timestamp,
        });

        transfer::share_object(reply);
    }

    /// Creates a reply to another reply (nested)
    public fun create_reply_to_reply(
        profile: &Profile,
        parent_reply: &mut Reply,
        user_address: address,
        content: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        validate_content(&content);
        
        let timestamp = clock::timestamp_ms(clock);
        let parent_reply_id = object::id(parent_reply);

        let reply = Reply {
            id: object::new(ctx),
            comment_id: parent_reply.comment_id,
            parent_reply_id: option::some(parent_reply_id),
            post_id: parent_reply.post_id,
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            content,
            created_at_ms: timestamp,
            like_count: 0,
            reply_count: 0,
        };

        let reply_id = object::id(&reply);
        parent_reply.reply_count = parent_reply.reply_count + 1;

        event::emit(ReplyCreated {
            reply_id,
            comment_id: parent_reply.comment_id,
            parent_reply_id: option::some(parent_reply_id),
            post_id: parent_reply.post_id,
            author_profile_id: object::id(profile),
            author_address: profile.owner,
            timestamp_ms: timestamp,
        });

        transfer::share_object(reply);
    }

    /// Deletes a reply from a comment
    public fun delete_reply_from_comment(
        reply: Reply,
        comment: &mut Comment,
        profile: &Profile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);
        assert!(reply.author_profile_id == object::id(profile), E_NOT_AUTHOR);
        
        if (comment.reply_count > 0) {
            comment.reply_count = comment.reply_count - 1;
        };

        event::emit(ReplyDeleted {
            reply_id: object::id(&reply),
            comment_id: reply.comment_id,
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let Reply { id, .. } = reply;
        object::delete(id);
    }

    /// Deletes a reply from another reply
    public fun delete_reply_from_reply(
        reply: Reply,
        parent_reply: &mut Reply,
        profile: &Profile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), E_NOT_PROFILE_OWNER);
        assert!(reply.author_profile_id == object::id(profile), E_NOT_AUTHOR);
        
        if (parent_reply.reply_count > 0) {
            parent_reply.reply_count = parent_reply.reply_count - 1;
        };

        event::emit(ReplyDeleted {
            reply_id: object::id(&reply),
            comment_id: reply.comment_id,
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let Reply { id, .. } = reply;
        object::delete(id);
    }

    /// Likes a comment
    public fun like_comment(
        profile: &mut Profile,
        comment: &mut Comment,
        user_address: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        
        let timestamp = clock::timestamp_ms(clock);

        let like = CommentLike {
            id: object::new(ctx),
            comment_id: object::id(comment),
            user_profile_id: object::id(profile),
            user_address,
            created_at_ms: timestamp,
        };

        let like_id = object::id(&like);
        
        comment.like_count = comment.like_count + 1;

        event::emit(CommentLiked {
            like_id,
            comment_id: object::id(comment),
            user_profile_id: object::id(profile),
            timestamp_ms: timestamp,
        });

        transfer::share_object(like);
    }

    /// Unlikes a comment
    public fun unlike_comment(
        like: CommentLike,
        profile: &mut Profile,
        comment: &mut Comment,
        user_address: address,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        assert!(like.user_profile_id == object::id(profile), E_NOT_AUTHOR);
        
        if (comment.like_count > 0) {
            comment.like_count = comment.like_count - 1;
        };

        event::emit(CommentUnliked {
            comment_id: like.comment_id,
            user_profile_id: object::id(profile),
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let CommentLike { id, .. } = like;
        object::delete(id);
    }

    /// Likes a reply
    public fun like_reply(
        profile: &mut Profile,
        reply: &mut Reply,
        user_address: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        
        let timestamp = clock::timestamp_ms(clock);

        let like = ReplyLike {
            id: object::new(ctx),
            reply_id: object::id(reply),
            user_profile_id: object::id(profile),
            user_address,
            created_at_ms: timestamp,
        };

        let like_id = object::id(&like);
        
        reply.like_count = reply.like_count + 1;

        event::emit(ReplyLiked {
            like_id,
            reply_id: object::id(reply),
            user_profile_id: object::id(profile),
            timestamp_ms: timestamp,
        });

        transfer::share_object(like);
    }

    /// Unlikes a reply
    public fun unlike_reply(
        like: ReplyLike,
        profile: &mut Profile,
        reply: &mut Reply,
        user_address: address,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        assert!(profile.owner == user_address, E_NOT_PROFILE_OWNER);
        assert!(like.user_profile_id == object::id(profile), E_NOT_AUTHOR);
        
        if (reply.like_count > 0) {
            reply.like_count = reply.like_count - 1;
        };

        event::emit(ReplyUnliked {
            reply_id: like.reply_id,
            user_profile_id: object::id(profile),
            timestamp_ms: clock::timestamp_ms(clock),
        });

        let ReplyLike { id, .. } = like;
        object::delete(id);
    }

    // === Public Accessor Functions ===

    public fun profile_owner(profile: &Profile): address {
        profile.owner
    }

    public fun profile_username(profile: &Profile): String {
        profile.username
    }

    public fun profile_bio(profile: &Profile): String {
        profile.bio
    }

    public fun profile_image_url(profile: &Profile): &Url {
        &profile.image_url
    }

    public fun profile_created_at(profile: &Profile): u64 {
        profile.created_at_ms
    }

    public fun post_author_id(post: &Post): ID {
        post.author_profile_id
    }

    public fun post_content(post: &Post): String {
        post.content
    }

    public fun post_like_count(post: &Post): u64 {
        post.like_count
    }

    public fun post_created_at(post: &Post): u64 {
        post.created_at_ms
    }

    public fun has_liked_post(profile: &Profile, post_id: ID): bool {
        vec_set::contains(&profile.liked_posts, &post_id)
    }

    public fun is_following(profile: &Profile, followed_id: ID): bool {
        vec_set::contains(&profile.following, &followed_id)
    }

    // === Test Module ===
    #[test_only]
    use sui::test_scenario as ts;
    

    #[test_only]
    const USER1: address = @0x1;
    #[test_only]
    const USER2: address = @0x2;

    #[test]
    fun test_create_profile_success() {
        let mut scenario = ts::begin(USER1);
        
        // Initialize
        init(SUITTER {}, scenario.ctx());
        scenario.next_tx(USER1);

        let mut registry = scenario.take_shared<Registry>();
        let clock = clock::create_for_testing(scenario.ctx());

        // Create profile (called by USER1 directly)
        create_profile(
            &mut registry,
            USER1, // user_address
            b"alice".to_string(),
            b"Hello world".to_string(),
            b"https://wal.app/pic.jpg".to_string(),
            &clock,
            scenario.ctx(),
        );

        scenario.next_tx(USER1);
        
        let profile = scenario.take_shared<Profile>();
        assert!(profile_username(&profile) == b"alice".to_string());
        assert!(profile_owner(&profile) == USER1);

        ts::return_shared(profile);
        ts::return_shared(registry);
        clock::destroy_for_testing(clock);
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = E_USERNAME_EXISTS)]
    fun test_prevent_duplicate_username() {
        let mut scenario = ts::begin(USER1);
        
        init(SUITTER {}, scenario.ctx());
        scenario.next_tx(USER1);

        let mut registry = scenario.take_shared<Registry>();
        let clock = clock::create_for_testing(scenario.ctx());

        // User 1 creates profile
        create_profile(
            &mut registry,
            USER1, // user_address
            b"alice".to_string(),
            b"Bio 1".to_string(),
            b"https://example.com/1.jpg".to_string(),
            &clock,
            scenario.ctx(),
        );

        scenario.next_tx(USER2);

        // User 2 tries to use same username 

        create_profile(
            &mut registry,
            USER2, // user_address
            b"alice".to_string(),
            b"Bio 2".to_string(),
            b"https://example.com/2.jpg".to_string(),
            &clock,
            scenario.ctx()
        );

        ts::return_shared(registry);
        clock::destroy_for_testing(clock);
        scenario.end();
    }

    #[test]
    fun test_create_post_success() {
        let mut scenario = ts::begin(USER1);
        
        init(SUITTER {}, scenario.ctx());
        scenario.next_tx(USER1);

        let mut registry = scenario.take_shared<Registry>();
        let clock = clock::create_for_testing(scenario.ctx());

        // Create profile
        create_profile(
            &mut registry,
            USER1, // user_address
            b"alice".to_string(),
            b"Hello".to_string(),
            b"https://wal.app/pic.jpg".to_string(),
            &clock,
            scenario.ctx()
        );

        scenario.next_tx(USER1);
        
        let profile = scenario.take_shared<Profile>();

        // Create post
        create_post(
            &profile,
            USER1, // user_address
            b"My first post!".to_string(),
            b"".to_string(),
            &clock,
            scenario.ctx()
        );

        ts::return_shared(profile);
        ts::return_shared(registry);
        clock::destroy_for_testing(clock);
        scenario.end();
    }
}
