/**
 * Transaction Builder for Suitter
 * 
 * Builds all transaction types for the Suitter application
 */

import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const REGISTRY_ID = import.meta.env.VITE_REGISTRY_ID;
const SUI_CLOCK_OBJECT_ID = '0x6';

export class TransactionBuilder {
  /**
   * Build a create_profile transaction (sponsor pays gas)
   * @param userAddress - The zkLogin address of the user (for identity)
   */
  static createProfile(
    userAddress: string,
    username: string,
    bio: string,
    imageUrl: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::create_profile`,
      arguments: [
        tx.object(REGISTRY_ID),
        tx.pure.address(userAddress), // NEW: Pass user address
        tx.pure.string(username),
        tx.pure.string(bio),
        tx.pure.string(imageUrl),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build a create_post transaction (backend-sponsored)
   */
  static createPost(
    profileId: string,
    userAddress: string,
    content: string,
    imageUrl: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::create_post`,
      arguments: [
        tx.object(profileId),
        tx.pure.address(userAddress), // User address for ownership verification
        tx.pure.string(content),
        tx.pure.string(imageUrl),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build an update_profile transaction
   */
  static updateProfile(
    profileId: string,
    username: string,
    bio: string,
    imageUrl: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::update_profile`,
      arguments: [
        tx.object(REGISTRY_ID),
        tx.object(profileId),
        tx.pure.string(username),
        tx.pure.string(bio),
        tx.pure.string(imageUrl),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build a like_post transaction
   */
  static likePost(
    profileId: string,
    postId: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::like_post`,
      arguments: [
        tx.object(profileId),
        tx.object(postId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build an unlike_post transaction
   */
  static unlikePost(
    likeId: string,
    profileId: string,
    postId: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::unlike_post`,
      arguments: [
        tx.object(likeId),
        tx.object(profileId),
        tx.object(postId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build a follow transaction
   */
  static follow(
    profileId: string,
    targetProfileId: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::follow`,
      arguments: [
        tx.object(profileId),
        tx.object(targetProfileId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build an unfollow transaction
   */
  static unfollow(
    followId: string,
    profileId: string,
    targetProfileId: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::unfollow`,
      arguments: [
        tx.object(followId),
        tx.object(profileId),
        tx.object(targetProfileId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build a delete_post transaction
   */
  static deletePost(
    postId: string,
    profileId: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::delete_post`,
      arguments: [
        tx.object(postId),
        tx.object(profileId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }

  /**
   * Build a delete_profile transaction
   */
  static deleteProfile(
    profileId: string
  ): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::suitter::delete_profile`,
      arguments: [
        tx.object(REGISTRY_ID),
        tx.object(profileId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ]
    });
    
    return tx;
  }
}
