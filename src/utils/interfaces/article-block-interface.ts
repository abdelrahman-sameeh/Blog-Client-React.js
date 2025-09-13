export type articleBlockTypes = 'text' | 'code' | 'image' | 'video'

export interface IArticleBlock {
  _id?: string;
  type?: articleBlockTypes;
  order?: number;
  data?: any;
  lang?: string;
}




