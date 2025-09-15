import type { IUser } from "./user-interface";



export interface IComment{
  _id?: string;
  author?: IUser;
  createdAt?: string;
  content?: string;
  likes?: IUser[];
  numberOfReplies?: number;
}
