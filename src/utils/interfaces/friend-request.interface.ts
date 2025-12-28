import type { IUser } from "./user-interface";



export interface IFriendRequest {
  _id: string;
  sender: IUser;
  receiver: IUser;
  createdAt: Date;
  updatedAt: Date;
}
