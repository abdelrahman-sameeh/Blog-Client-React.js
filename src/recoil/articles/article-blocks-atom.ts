import { atom } from "recoil";
import type { IArticleBlock } from "../../utils/interfaces/article-block-interface";



export const articleBlocksAtom = atom<IArticleBlock[]>({
  key: "article-blocks-atom",
  default: []
})


export const articleBlockAtom = atom<IArticleBlock>({
  key: "article-block-atom",
  default: {}
})
