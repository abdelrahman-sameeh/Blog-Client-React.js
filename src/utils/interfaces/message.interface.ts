import type { IChat } from "./chat.interface";
import type { IUser } from "./user-interface";


export interface IMessage {
  _id: string;
  chat: IChat;
  sender: IUser;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
  seenBy: IUser[];
  replyTo: IMessage | null;
  deletedFor: {
    user: IUser;
    deletedType: 'soft' | 'hard'
  }
  createdAt: Date;
  updatedAt: Date;
}