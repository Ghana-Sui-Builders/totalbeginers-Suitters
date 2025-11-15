/**
 * TypeScript type definitions for the Suitter backend API
 */

import { Request } from 'express';

/**
 * Extend Express Request to include authenticated user address
 */
declare global {
  namespace Express {
    interface Request {
      userAddress?: string;
    }
  }
}

// ============================================================================
// Request Body Interfaces
// ============================================================================

export interface RegisterProfileRequest {
  username: string;
  bio: string;
  image_url_str: string;
  user_address: string;
}

export interface CreatePostRequest {
  content: string;
  image_url_str?: string;
}

export interface LikePostRequest {
  post_id: string;
}

export interface UpdateProfileRequest {
  new_username: string;
  new_bio: string;
  new_image_url_str: string;
}

export interface FollowUserRequest {
  profile_to_follow_id: string;
}

export interface UnfollowUserRequest {
  follow_id: string;
}

export interface UnlikePostRequest {
  like_id: string;
}

export interface DeletePostRequest {
  post_id: string;
}

// ============================================================================
// Response Interfaces
// ============================================================================

export interface SuiTransactionResponse {
  success: boolean;
  message: string;
  data?: {
    digest: string;
    effects?: any;
    objectChanges?: any;
    [key: string]: any;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  code?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  network: string;
  sponsorAddress: string;
  sponsorBalance?: string;
  timestamp: string;
}

// ============================================================================
// JWT Payload Interface
// ============================================================================

export interface JwtPayload {
  sub?: string;      // Standard JWT subject field (user address)
  address?: string;  // Custom field for Sui address
  email?: string;    // Alternative field
  iat?: number;      // Issued at
  exp?: number;      // Expiration
  iss?: string;      // Issuer
}

// ============================================================================
// Blockchain Object Interfaces
// ============================================================================

export interface ProfileObject {
  id: string;
  owner: string;
  username: string;
  bio: string;
  image_url: string;
  created_at_ms: string;
}

export interface PostObject {
  id: string;
  author_profile_id: string;
  author_address: string;
  content: string;
  image_url?: string;
  created_at_ms: string;
  like_count: number;
}

export interface LikeObject {
  id: string;
  post_id: string;
  user_profile_id: string;
  user_address: string;
  created_at_ms: string;
}

export interface FollowObject {
  id: string;
  follower_id: string;
  follower_address: string;
  followed_id: string;
  followed_address: string;
  created_at_ms: string;
}
