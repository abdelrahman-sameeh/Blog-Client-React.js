import type { IUser } from "./user-interface";


export interface IUserProfileStats {
  user?: IUser;
  numberOfArticlesForUser?: number,
  followersCount?: number,
  followingCount?: number,
  followersOnlyCount?: number,
  followingOnlyCount?: number,
  pendingFriendRequestSentCount?: number
}