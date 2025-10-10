import type { IArticleBlock } from "./article-block-interface";
import type { ICategory } from "./category-interface";
import type { IComment } from "./comment-interface";
import type { ITag } from "./tag-interface";
import type { IUser } from "./user-interface";

export interface IArticle {
  _id?: string;
  title?: string;
  user?: IUser;
  category?: ICategory;
  createdAt?: Date;
  updatedAt?: Date;
  blocks?: IArticleBlock[];
  tags?: ITag[];
  likes?: IUser[];
  comments?: IComment[];
  isSavedArticle?: boolean;
}

