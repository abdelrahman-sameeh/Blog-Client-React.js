import { atom } from "recoil";
import type { IArticleBlock } from "../../utils/interfaces/article-block-interface";



export const articleBlocksAtom = atom<IArticleBlock[]>({
  key: "blocks-atom",
  default: []
})