export interface IAttachment {
  url: string;
  attachmentType: 'image' | 'video' | 'document'
  size: number;
  _id: string;
  mimetype: string;

  deleteFor: string[];

  deleteForAll: {
    isDeleted: boolean;
    deletedBy?: string;
    deletedAt?: Date;
  };
}