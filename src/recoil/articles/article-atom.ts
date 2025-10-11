import { atom } from "recoil";
import type { IArticle } from "../../utils/interfaces/article.interface";



export const articleAtom = atom<IArticle>({
  key: "article-atom",
  default: {}
})

