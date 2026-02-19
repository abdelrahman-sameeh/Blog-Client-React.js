import type { IAttachment } from "./attachment.interface";
import type { IChat } from "./chat.interface";
import type { IUser } from "./user-interface";


export interface IMessage {
  _id: string;
  chat: IChat;
  sender: IUser;
  content: string;
  type: 'text' | 'voice' | 'system';
  seenBy: IUser[];
  replyTo: IMessage | null;
  attachments: IAttachment[];
  deletedFor: IUser[] | string[];
  deletedForAll: {
    isDeleted: boolean;
    deletedBy?: string;
    deletedAt?: Date;
  };
  isDeletedForAll?: boolean;
  createdAt: Date;
  updatedAt: Date;
}